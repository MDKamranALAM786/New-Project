import driver from "../config/connect.js";

export const projectGraph = async (session) => {
    try {
        let check = await session.run(`
            CALL gds.graph.exists("roadGraph")
        `);

        let projected = check.records.length != 0 && check.records[0].get("exists");
        console.log(`Projected : ${projected}`);
        if(projected) {
            await session.run(`
                CALL gds.graph.drop("roadGraph");
            `);
        }

        await session.run(`
            CALL gds.graph.project(
                "roadGraph",
                "Intersection",
                {
                    ROAD : {
                        properties : "travel_time"
                    }
                }
            );
        `);
    } catch(err) {
        console.log("Error in Projecting Graph");
        throw(err);
    }
};

export const getRoute = async (src, dest) => {
    let session = driver.session({database : "routing-project"});

    try {
        await projectGraph(session);
        const result = await session.run(`
            MATCH (source:Intersection {name:$src}), (destination:Intersection {name:$dest})

            CALL gds.shortestPath.dijkstra.stream("roadGraph", {
                sourceNode : source,
                targetNode : destination,
                relationshipWeightProperty : "travel_time"
            })
            YIELD totalCost, nodeIds

            RETURN totalCost, nodeIds;`,
            {src : src, dest : dest}
        );
        
        let record = result.records[0];
        if(!record) {
            console.log("No Route Found");
            return(null);
        }

        let totalTime = record.get("totalCost");
        const nodeIds = record.get("nodeIds");

        const pathResult = await session.run(`
            UNWIND $nodeIds AS id
            MATCH (n:Intersection)
            WHERE id(n) = id
            RETURN n.name AS name`,
            {nodeIds : nodeIds}
        );
        let names = pathResult.records;

        let nodes = [];
        names.forEach((name) => {
            nodes.push(name.get("name"));
        });

        let shortestPath = {
            route : nodes,
            totalTime : totalTime
        };
        console.log(shortestPath);

        return(shortestPath);
    } catch(err) {
        console.log(`Error : ${err.cause}`);
        return(null);
    } finally {
        await session.close();
    }
};
