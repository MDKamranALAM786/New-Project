import driver from "../config/connect.js";

export const changeTraffic = async (src, dest, newTime) => {
    let session = driver.session({database : "routing-project"});

    try {
        const result = await session.run(`
            MATCH (:Intersection {name:$src})-[r:ROAD]->(:Intersection {name:$dest})
            WITH r
            SET r.travel_time = r.travel_time + $newTime
            RETURN r`,
            {src : src, dest : dest, newTime : newTime}
        );

        let hasChanged, message;
        if(!result.records || result.records.length === 0) {
            hasChanged = false;
            message = "No Roads Found!";
        } else {
            hasChanged = true;
            message = "Travel Time changed Successfully!";
        }

        let finalResult = {
            hasChanged : hasChanged,
            message : message
        };

        return(finalResult);
    } catch(err) {
        console.log(`Error : ${err.cause}`);
    } finally {
        await session.close();
    }
};

export const updateAllTraffic = async (congestionLevels) => {
    let session = driver.session({database : "routing-project"});

    try {
        let {highway, main_road, streets} = congestionLevels;
        const result = await session.run(`
            MATCH (a:Intersection)-[r:ROAD]->(b:Intersection)
            WITH r,
                CASE
                    WHEN r.type = "highway" THEN $highway
                    WHEN r.type = "main" THEN $main
                    WHEN r.type = "street" THEN $streets
                    ELSE 1.0
                END AS factor
            SET r.traffic_factor = factor,
                r.travel_time = r.base_time * factor
            RETURN COUNT(r) AS updated`,
            {
                highway : highway,
                main : main_road,
                streets : streets
            }
        );
        
        let hasChanged, message;
        let countUpdated = Number(result.records[0].get("updated"));
        if(countUpdated > 0) {
            hasChanged = true;
            message = "Travel Time for all Roads changed successfully";
        } else {
            hasChanged = false;
            message = "No Roads Found!";
        }

        let finalResult = {
            hasChanged : hasChanged,
            message : message
        }

        return(finalResult);
    } catch(err) {
        console.log(`Error : ${err.cause}`);
        return({
            hasChanged : false,
            message : "Traffic updated failed!"
        });
    } finally {
        await session.close();
    }
};
