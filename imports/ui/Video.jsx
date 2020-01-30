import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, ProgressCircular, ToolbarButton, Card, ListHeader, ListTitle, ProgressBar } from 'react-onsenui'
import { connect } from "react-redux";
import render from 'render-media'

function Video({ showMenu, client }) {
    const [vid, setVid] = useState(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id')
        Meteor.call('vids.findOne', id, function (err, result) {
            if (err) {
                console.log(err)
                return
            }
            setVid(result)

        }); 
        return function cleanup(){

        }
    }, [])

    useEffect(() => {
        let mounted = true
        if (vid == null) {
            return
        }

        torrentId = vid.magnetUri

        torrent = client.get(torrentId)

        if(torrent != null){
            torrent.on('done', () => {

            })

            torrent.on('download', function (bytes) {
                // console.log(torrent.progress)
                if (mounted){
                setProgress(torrent.progress * 100)
                }
            })
            torrent.files.forEach(function (file) {
                setProgress(torrent.progress * 100)
                render.render(file, "#player")
            })
            return
        }


        client.on('error', err => {
            console.log('[+] Webtorrent error: ' + err.message);
        });

        client.add(torrentId, (torrent) => {
            console.log('Client is downloading:', torrent.infoHash)
            torrent.on('done', () => {

            })

            torrent.on('download', function (bytes) {
                // console.log(torrent.progress)
                if (mounted){
                    setProgress(torrent.progress * 100)
                    }
            })
            torrent.files.forEach(function (file) {
                render.render(file, "#player")
            })
        })

        return function cleanup() {
            // client.remove(torrentId)
            mounted = false
        };
    }, [vid]);

    function progressbar() {
        switch (progress) {
            case 0:
                return <Card>
                    <ProgressBar indeterminate />
                </Card>
            case 100:
                return
            default:
                return <Card>
                    <ProgressBar value={progress} />
                </Card>
        }
    }

    if (vid == null) {
        return <Page renderToolbar={() =>
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
                <ProgressCircular indeterminate />
            </Card>
        </Page>
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
            {progressbar()}
            <Card>
                <video id="player" width="100%" style={{ maxHeight: 500 }} autoPlay></video>
                <ListHeader modifier="ios">{vid.title}</ListHeader>
                <ListTitle modifier="ios">{vid.description}</ListTitle>
            </Card>
        </Page>
    )
}

const mapStateToProps = (state) => {
    return {
        client: state.webtorrentreducer.client
    };
}


export default connect(mapStateToProps)(
    Video
);