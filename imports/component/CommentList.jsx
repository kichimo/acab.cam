import React from 'react'
import { Card, ListItem, ListTitle, ListHeader } from 'react-onsenui'
import { Comments } from '../api/comments';
import { withTracker } from 'meteor/react-meteor-data';

function CommentList({ comments }) {

    function renderComments() {
        return comments.map((comment) => (
            <Card key={comment._id}>
                <ListTitle>
                    <div className="center">{comment.author}</div>
                </ListTitle>
                <ListItem>
                        {comment.comment}
                </ListItem>
            </Card>
        )
        )
    }

    return (
        <>{renderComments()}</>
    )
}


export default withTracker(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    Meteor.subscribe('comments', id);
    return {
        comments: Comments.find({}).fetch(),
    };
})(CommentList);