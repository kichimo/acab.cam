import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, ToolbarButton, SearchInput, Card, Row } from 'react-onsenui'
import VidCard from '../component/VideoCard'
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker'
import { Vids, VidsIndex } from '../api/videos';

function Index({ showMenu }) {
    const [vids, setVids] = useState([])
    const [search, setSearch] = useState("")
    useEffect(() => {

        Tracker.autorun(function () {
            if(search == ""){
                setVids(Vids.find().fetch())
            }
            else{
                let cursor = VidsIndex.search(search)
                setVids(cursor.fetch())
            }
        })
    }, [search]);

    function renderVids() {
        return vids.map((vid) => (
            <VidCard key={vid._id} vid={vid} />
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
        <Card>
            <SearchInput
                style={{width:"100%"}}
                value={search}
                onChange={(event) => { setSearch(event.target.value) }}
                modifier='material'
                placeholder='Search' />
        </Card>
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