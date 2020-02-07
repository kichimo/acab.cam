import React, { useState } from 'react'
import { Card, Input, Button, ListItem } from 'react-onsenui'

export default function CommentBox({ id }) {
    const [author, setAuthor] = useState("");
    const [comment, setComment] = useState("");

    function SubmitComment() {
        if (author == "" || comment == "") {
            return
        }
        Meteor.call('comments.insert', id, comment, author, function (err, result) {
            if (err) {
                console.log(err)
                return
            }
            setAuthor("")
            setComment("")
        });
    }

    function Cancel() {
        setAuthor("")
        setComment("")
    }

    return (
        <Card>
            <Input
                style={{ paddingBottom: 10 }}
                // float
                value={author}
                onChange={(event) => { setAuthor(event.target.value) }}
                modifier='material'
                placeholder='Name' />
            <br />
            <Input
                style={{ width: '100%', paddingBottom: 5 }}
                // float
                value={comment}
                onChange={(event) => { setComment(event.target.value) }}
                modifier='material'
                placeholder='Comment' />
            <ListItem>
                <div className="right">
                    <Button modifier="quiet" onClick={() => { Cancel() }}>
                        Cancel
            </Button>
                    <Button style={{ marginLeft: 20 }} onClick={() => { SubmitComment() }}>
                        {"  Send  "}
                    </Button>
                </div>
            </ListItem>
        </Card>
    )
}
