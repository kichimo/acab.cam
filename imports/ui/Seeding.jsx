import React, {useState} from 'react'
import { Page, Toolbar, Icon, ToolbarButton, List, ListHeader} from 'react-onsenui'
import { withTracker } from 'meteor/react-meteor-data';
import { Vids } from '../api/videos'
import  SeedingListItem  from '../component/SeedingListItem'
import { connect } from "react-redux";

function Seeding({ showMenu, vids, client }) {
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
                    <SeedingListItem vid={vid} key={idx} client={client}/>
                )}
            // renderFooter={this.renderFooter}
            />
        </Page>
    )
}



const mapStateToProps = (state) => {
    return {
      client: state.webtorrentreducer.client,
    };
  }


export default connect(mapStateToProps)(
    withTracker(() => {
        Meteor.subscribe('vids');
        return {
            vids: Vids.find({}).fetch(),
        };
    })(Seeding)
);
