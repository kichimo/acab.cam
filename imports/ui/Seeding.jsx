import React from 'react'
import { Page, Toolbar, Icon, ToolbarButton, List, ListHeader} from 'react-onsenui'
import { withTracker } from 'meteor/react-meteor-data';
import { Vids } from '../api/videos'
import  SeedingListItem  from '../component/SeedingListItem'

function Seeding({ showMenu, vids }) {
    // var client = new window.WebTorrent()

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
        {/* <ListHeader>{client.uploadSpeed}</ListHeader> */}
            <List
                dataSource={vids}
                // renderHeader={renderHeader}
                renderRow={(vid, idx) => (
                    <SeedingListItem vid={vid} key={idx}/>
                )}
            // renderFooter={this.renderFooter}
            />
        </Page>
    )
}

export default withTracker(() => {
    Meteor.subscribe('vids');
    return {
        vids: Vids.find({}).fetch(),
    };
})(Seeding);
