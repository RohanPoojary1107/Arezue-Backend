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

exports.getSkills = [
    async function (req, res, next) {
        let uid = validator.escape(req.params.uid);
        if (validator.isEmpty(uid)) {
            res.status(400).send("One of the field is empty");
            return;
        }
        if (!validator.isUUID(uid, [4])) {
            res.status(400).send("Invalid UUID");
            return;
        }
        let Query = `SELECT * FROM skills where uid = $1`;
        Promise.all([pool.query(Query, [uid])])
            .then(result => {
                var rows = result.filter(r => r.rowCount > 0).map(r => r.rows)

                if (rows[0]) {
                    res.status(200).send(rows[0])
                } else {
                    res.status(400).send(`Jobseeker could not be found`);
                }
            })
            .catch(e => {
                res.status(500);
                res.send(sendError(500, '/jobseeker error ' + e))
            });
    }
];

exports.addSkill = [
    async function (req, res, next) {
        let uid = validator.escape(req.params.uid);
        let skill = validator.escape(req.body.skill);
        let level = validator.escape(req.body.level);
        let years = validator.escape(req.body.years);
        if (validator.isEmpty(uid) || validator.isEmpty(skill)) {
            res.status(400).send("One of the field is empty");
            return;
        }
        if (!validator.isUUID(uid, [4])) {
            res.status(400).send("Invalid UUID");
            return;
        }
        let skillNameQuery = `SELECT id FROM pre_skills WHERE LOWER(skill) = LOWER($1)`;
        
        var skill_id = 0;
        Promise.all([pool.query(skillNameQuery, [skill])])
            .then(result => {
                var rows = result.filter(r => r.rowCount > 0).map(r => r.rows);
                if (rows[0]) {
                    skill_id = rows[0][0].id;
                    console.log(`if ${skill_id}`);
                } else {
                    pool.query(`INSERT INTO pre_skills(skill) values(LOWER($1)) RETURNING id;`, [skill], (error, response) => {
                        if (error) {
                            res.status(400).send(`Adding new predefined skill error: ${error}`);
                            return;
                        } else {
                            skill_id = response.rows[0].id;
                            console.log(response)
                            console.log(`else ${skill_id}`)
                        }
                    })
                }
                    let Query = `INSERT INTO skills (uid, skill_id, level, years) VALUES ($1, $2, $3, $4) returning uid`
                    pool.query(Query, [uid, skill_id, level, years], (error, response) => {
                        if (error) {
                            console.log(`final ${skill_id}`)
                            res.status(400).send(`Adding new jobseeker skill ${error}`);
                            return;
                        } else {
                            res.status(200).send("Added jobseeker skill")
                        }
                    })


            }).catch(e => {
                res.status(500);
                res.send(sendError(500, '/jobseeker error ' + e))
            });
      
       
//         Promise.all([pool.query(Query, [uid, skill_id, level, years])])
//             .then(result => {
//                 var rows = result.filter(r => r.rowCount > 0).map(r => r.rows);
//                 console.log(rows)
//                 if (rows[0]) {
//                     res.status(200).send(rows);
//                 } else {
//                     res.status(400).send(`Jobseeker could not be found`);
//                 }
//             }).catch(e => {
//                 res.status(500);
//                 res.send(sendError(500, '/jobseeker error ' + e))
//             });
//     }
    }];

exports.deleteSkill = [
    async function (req, res, next) {
        let uid = validator.escape(req.params.uid);
        let skill = validator.escape(req.params.skill);
        if (validator.isEmpty(uid) || validator.isEmpty(skill)) {
            res.status(400).send("One of the field is empty");
            return;
        }
        if (!validator.isUUID(uid, [4])) {
            res.status(400).send("Invalid UUID");
            return;
        }
        let Query = `DELETE FROM skills WHERE uid = $1 and skill = $2 returning uid`;
        Promise.all([pool.query(Query, [uid, skill])])
            .then(result => {
                var rows = result.filter(r => r.rowCount > 0).map(r => r.rows);

                if (rows.length == 1) {
                    res.status(200).send(rows[0][0]);
                } else {
                    res.status(404).send('Delete is case sensitive');
                }
            })
            .catch(e => {
                res.status(500);
                res.send(sendError(500, '/jobseeker error ' + e))
            });
    }
];