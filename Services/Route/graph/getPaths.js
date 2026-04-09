import driver from "../config/connect.js";

export const getRoute = async (src, dest) => {
    let session = driver.session({database : "routing-project"});

    try {
        const result = await session.run(`
            MATCH paths=(a:Intersection {name:$src})-[:ROAD*]->(b:Intersection {name:$dest})
            RETURN paths,
                reduce(time=0, rel IN relationships(paths) | time+rel.travel_time) AS totalTime
            ORDER BY totalTime`,
            {src : src, dest : dest}
        );
        if(!result || result.records.length == 0) {
            return(null);
        }

        let paths = [];
        let records = result.records;

        // processing every path
        records.forEach((record) => {
            let path = [];
            let travelTime = Number(record._fields[1]);

            // get start node of current path
            let start = record._fields[0].start.properties.name;
            path.push(start);

            // get rest of the nodes via edges (edges - segments)
            let segments = record._fields[0].segments;
            segments.forEach((segment) => {
                let end = segment.end.properties.name;
                path.push(end);
            });

            // add current path data
            let pathData = {
                path : path,
                travelTime : travelTime
            };
            paths.push(pathData);
        });

        return(paths);
    } catch(err) {
        console.log(`Error : ${err.cause}`);
        return(null);
    } finally {
        await session.close();
    }
};
