import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, ProgressCircular, ToolbarButton, Card, ListHeader, ListTitle, ProgressBar } from 'react-onsenui'
import { connect } from "react-redux";
import { addVideo } from '../redux/action'
import render from 'render-media'
import parseTorrent from 'parse-torrent'

function Video({ showMenu, client, videos, addVideo }) {
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
    }, [])

    useEffect(() => {
        if (vid == null) {
            return
        }
        // const urlParams = new URLSearchParams(window.location.search);
        // const id = urlParams.get('id')
        torrentId = vid.magnetUri
        infoHash =  parseTorrent(torrentId).infoHash
        if (videos[infoHash]) {
            // console.log(videos[infoHash].file)
            setProgress(100)
            render.render(videos[infoHash].file, "#player")
            return
        }
        client.on('error', err => {
            console.log('[+] Webtorrent error: ' + err.message);
        });

        client.add(torrentId, (torrent) => {
            console.log('Client is downloading:', torrent.infoHash)
            torrent.on('done', () => {
                torrent.files.forEach((file) => {
                    addVideo(torrent.infoHash, file)
                })
            })

            torrent.on('download', function (bytes) {
                // console.log(torrent.progress)
                setProgress(torrent.progress * 100)
            })
            torrent.files.forEach(function (file) {
                render.render(file, "#player")
            })
        })

        return function cleanup() {
            // client.remove(torrentId)
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
        client: state.webtorrentreducer.client,
        videos: state.webtorrentreducer.videos
    };
}


export default connect(mapStateToProps, { addVideo })(
    Video
);