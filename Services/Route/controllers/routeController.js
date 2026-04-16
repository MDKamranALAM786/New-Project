import httpStatus from "http-status";

import {getRoute} from "../graph/getPaths.js";

export const getRouteHandler = async (req, res) => {
    try {
        let {src, dest} = req.query;
        if(!src || !dest) {
            return(res.status(httpStatus.BAD_REQUEST).json({message : "Missing Source/Destination"}));
        }

        let path = await getRoute(src, dest);
        if(!path) {
            return(res.status(httpStatus.NOT_FOUND).json({message : "No Route Found"}));
        } else {
            return(res.status(httpStatus.OK).json({message : "Path Found", path : path}));
        }
    } catch(err) {
        console.log(`Error : ${err.cause}`);
        return(res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : err.message}));
    }
};
