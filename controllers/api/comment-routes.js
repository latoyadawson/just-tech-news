const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');

//GET comment
router.get('/', (req, res) =>{
   Comment.findAll({
        attributes: [
            'comment_text', 
            'post_id', 
            'user_id', 
            'created_at',
        ],
        include: [
            {
                model: User,
                attributes: ['id']
            },
            {
                model: Post,
                attributes: ['id']
            }
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST comment (create)
router.post('/', (req, res) =>{
    // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            user_id: req.session.user_id,
            post_id: req.body.post_id
            
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
    
});


//DELETE comment
router.delete('/:id', (req, res) =>{
   Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({message: 'No comment found with this id'});
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    
});

module.exports = router;