var express = require('express');
var router = express.Router({ mergeParams: true, strickt: true});

const db = require('./queries');
router.get('/v1/getAll', db.getAllJobSeekers);
router.route('/v1/init')
    /**
     *  @swagger
     * 
     *  /init:
     *      post:
     *          description: Get either the jobseeker or employer's pre-information if exists
     *          tags:
     *              - Initialization
     *          produces: 
     *              - application/json
     *          parameters:
     *              - name: firebaseID
     *                description: FirebaseID generated by Firebase
     *                in: formData
     *                requried: true
     *                type: string 
     *          responses:
     *              200:
     *                  description: Successfully get an employer/jobseeker
     *              400:
     *                  description: User could not be found
     *              500:
     *                  description: Internal server error
     * 
     * 
     */
    .post(db.init);

router.route('/v1/employer')
    /**
     *  @swagger
     * 
     *  /employer:
     *      post:
     *          description: Create an employer
     *          tags:
     *              - Employer
     *          produces: 
     *              - application/json
     *          parameters:
     *              - name: firebaseID
     *                description: FirebaseID generated by Firebase
     *                in: formData
     *                requried: true
     *                type: string
     *              - name: email
     *                description: E-mail of the employer
     *                in: formData
     *                requried: true
     *                type: string
     *              - name: name
     *                description: Name of the employer
     *                in: formData
     *                requried: true
     *                type: string
     *              - name: company
     *                description: Id of the company
     *                in: formData
     *                requried: true
     *                type: string
     * 
     *          responses:
     *              200:
     *                  description: Successfully created an employer
     *              400:
     *                  description: User could not be created
     *              500:
     *                  description: Internal server error
     * 
     * 
     */
    .post(db.createEmployer)
    /**
     *  @swagger
     * 
     *  /employer?uid={uid}:
     *      get:
     *          description: Returns information about specified jobseeker
     *          tags:
     *              - Employer
     *          produces: 
     *              - application/json
     *          parameters:
     *              - name: uid
     *                description: UID for the specific user
     *                in: path
     *                requried: true
     *                type: string
     * 
     *          responses:
     *              200:
     *                  description: Successfully get the Jobseeker
     *              400:
     *                  description: User could not be found
     *              500:
     *                  description: Internal server error
     * 
     * 
     */
    .get(db.getEmployer)
    /**
     *  @swagger
     * 
     *  /employer:
     *      put:
     *          description: Modify information of specified employyer
     *          tags:
     *              - Employer
     *          produces: 
     *              - application/json
     *          parameters:
     *              - name: UUID
     *                description: UUID of the corresponding employer
     *                in: formData
     *                requried: true
     *                type: string
     * 
     *          responses:
     *              200:
     *                  description: Successfully modified the employer
     *              400:
     *                  description: User could not be found
     *              500:
     *                  description: Internal server error
     * 
     * 
     */
    .put(db.updateEmployer)

router.route('/v1/jobseeker?:firebaseID?')
    /**
     *  @swagger
     * 
     *  /jobseeker:
     *      post:
     *          description: Create a jobseeker
     *          tags:
     *              - Jobseeker
     *          produces: 
     *              - application/json
     *          parameters:
     *              - name: firebaseID
     *                description: FirebaseID generated by Firebase
     *                in: formData
     *                requried: true
     *                type: string
     *              - name: email
     *                description: E-mail of the jobseeker
     *                in: formData
     *                requried: true
     *                type: string
     *              - name: name
     *                description: Name of the jobseeker
     *                in: formData
     *                requried: true
     *                type: string
     * 
     *          responses:
     *              200:
     *                  description: Successfully created a jobseeker
     *              400:
     *                  description: User could not be created
     *              500:
     *                  description: Internal server error
     * 
     * 
     */
    .post(db.createJobseeker)
    /**
     *  @swagger
     * 
     *  /jobseeker?uid={uid}:
     *      get:
     *          description: Returns information about specified jobseeker
     *          tags:
     *              - Jobseeker
     *          produces: 
     *              - application/json
     *          parameters:
     *              - name: uid
     *                description: UID for the specific user
     *                in: path
     *                requried: true
     *                type: string
     * 
     *          responses:
     *              200:
     *                  description: Successfully get the Jobseeker
     *              400:
     *                  description: User could not be found
     *              500:
     *                  description: Internal server error
     * 
     * 
     */
    .get(db.getJobseeker);


module.exports = router;