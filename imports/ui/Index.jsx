import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, ToolbarButton, Button , Row} from 'react-onsenui'
import VidCard from '../component/VideoCard'
import { withTracker } from 'meteor/react-meteor-data';
 
import { Vids } from '../api/videos';

function Index({ showMenu, vids }) {
    useEffect(() => {
        // Update the document title using the browser API
        console.log("test")
        Meteor.call('vids.find', function (err, result) {
            if (err) {
                console.log(err)
                return
            }
            console.log(result)
        });
      },[]);

    function renderVids(){
        return vids.map((vid) => (
            <VidCard key={vid._id} vid={vid}/>
        )
        )
    }

    return (
        <Page renderToolbar={() =>
            <Toolbar>
                <div className="left">
                    <ToolbarButton onClick={() => {
                        showMenu()
                    }}>
                        <Icon icon="bars" />
                    </ToolbarButton>
                </div>
                <div className="center">
                    acab
                </div>
                <div className="right">
                </div>
            </Toolbar>}
        >
            <Row>
                {renderVids()}
            </Row>
        </Page>
    )
}

export default withTracker(() => {
    Meteor.subscribe('vids');
    return {
      vids: Vids.find({}).fetch(),
    };
  })(Index);