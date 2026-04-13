import {updateAllTraffic} from "./updateTraffic.js";

export const generateCongestionLevels = () => {
    const time = new Date().getHours();

    let congestionLevels;

    if(time >= 6 && time < 9) {
        congestionLevels = {
            highway : 0.7,
            main_road : 0.85,
            streets : 0.6
        };
    } else if(time >= 9 && time < 14) {
        congestionLevels = {
            highway : 1.8,
            main_road : 1.6,
            streets : 1.3
        };
    } else if(time >= 14 && time < 17) {
        congestionLevels = {
            highway : 1.3,
            main_road : 1.2,
            streets : 1.0
        };
    } else if(time >= 17 && time < 21) {
        congestionLevels = {
            highway : 2.0,
            main_road : 2.0,
            streets : 1.6
        };
    } else if(time >= 21 && time < 24) {
        congestionLevels = {
            highway : 0.8,
            main_road : 0.7,
            streets : 0.6
        };
    } else {
        congestionLevels = {
            highway : 0.5,
            main_road : 0.6,
            streets : 0.5
        };
    }

    return(congestionLevels);
};

export const runSimulation = async () => {
    let congestionLevels = generateCongestionLevels();
    await updateAllTraffic(congestionLevels);
};
