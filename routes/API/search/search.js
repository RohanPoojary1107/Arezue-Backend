// Global var and functions
const pool = require('../../../config');
const validator = require('validator');

function sendJSON(statusCode, payload) {
    return JSON.stringify({
        status_code: statusCode,
        payload: payload
    })
}

function sendError(statusCode, message, additionalInfo = {}) {
    return JSON.stringify({
        status_code: statusCode,
        error: {
            message: message,
            additional_information: additionalInfo
        }
    })
}

exports.searchCandidates = [
    async function(req, res, next) {
        var reqQuery = req.body;
        
        if ("skills" in reqQuery) {
            skills = reqQuery.skills.split(",").map(skill => skill.toLowerCase());
            
            let query = "SELECT * FROM resumes;";
            pool.query(query)
            .then(result => {
                var rows = result.rows;
                if (rows.length > 0) {
                    //Filter out for resumes without the skill attribute
                    var candidates = rows.filter(r => r.hasOwnProperty("resume") && r.resume.hasOwnProperty("skill"))

                    //postgres jsons with subrrays are returned as arrays, need to sanitize (not the best way)
                    candidates.forEach(c => {
                        if (typeof(c.resume.skill) == "string") {
                            c.resume.skill = c.resume.skill.replace("[", "").replace("]","").split(",")
                        }
                    })

                    //filter for resumers that contain skills as passed in the query body
                    candidates = candidates.filter(r => r.resume.skill.some((el) => {return skills.includes(el.toLowerCase())}))
                    return res.status(200).send(sendJSON(200, candidates))

                } else {
                    return res.status(200).send(sendJSON(200, {}));
                }
            })
            .catch(e => {
                res.status(500, res.send(sendError(500, '/search ' + e)));
            })
            
        } else {
            // did not pass in any query data successfully return "nothing".
            console.log("here");
            res.status(200).send(sendJSON(200, {}));
            return;
        }
    }
]