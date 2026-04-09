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
