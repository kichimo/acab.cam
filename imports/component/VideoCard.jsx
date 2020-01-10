import React from 'react'
import { Card, ListItem, ListTitle, ListHeader } from 'react-onsenui'
import { Route } from 'react-router'

export default function VideoCard({ vid }) {
    return (
        <Route render={({ history }) => (
            <Card style={{ maxWidth: "30%", minWidth: 300, minHeight: 300 }} onClick={() => { history.push("/video?id=" + vid._id) }}>
                <img src={vid.previewImg} alt="preview" style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    width: "auto",
                    height: "100%"
                }}></img>
                <ListTitle style={{backgroundColor:"#d9d9d9" , color:"black"}}>{vid.title}</ListTitle>
                <ListHeader style={{backgroundColor:"transparent"}}>{vid.description}</ListHeader> 
            </Card>
        )} />
    )
}
