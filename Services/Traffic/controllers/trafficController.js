import httpStatus from "http-status";

import {changeTraffic} from "../graph/updateTraffic.js";

export const changeTrafficHandler = async (req, res) => {
    try {
        let {src, dest, newTime} = req.body;
        if(!src || !dest || !newTime) {
            return(res.status(httpStatus.BAD_REQUEST).json({message : "Missing Data"}));
        }

        let {hasChanged, message} = await changeTraffic(src, dest, newTime);
        if(hasChanged) {
            return(res.status(httpStatus.OK).json({message : message}));
        } else {
            return(res.status(httpStatus.NOT_FOUND).json({message : message}));
        }
    } catch(err) {
        console.log(`Error : ${err.cause}`);
        return(res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : err.message}));
    }
};
