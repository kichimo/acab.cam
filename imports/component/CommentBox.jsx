import React, { useState }from 'react'
import { Card, Input, Button } from 'react-onsenui'

export default function CommentBox({ id }) {
    const [author, setAuthor] = useState("");
    const [comment, setComment] = useState("");

    function SubmitComment(){
        if(author == "" || comment== ""){
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

    return (
        <Card>
            <Input
            style={{paddingBottom:10}}
                float
                value={author}
                onChange={(event) => { setAuthor(event.target.value) }}
                modifier='material'
                placeholder='Name' />
                <br/>
            <Input
            style={{width:'100%'}}
                float
                value={comment}
                onChange={(event) => { setComment(event.target.value)}}
                modifier='material'
                placeholder='Comment' />
            <Button onClick={()=>{SubmitComment()}}>
               Send
            </Button>
        </Card>
    )
}
