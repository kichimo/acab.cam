import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, ProgressCircular, ToolbarButton, Card, ListHeader, ListTitle, ProgressBar } from 'react-onsenui'

export default function Video({ showMenu }) {
    const [vid, setVid] = useState(null)
    const [progress, setProgress] = useState(0)
    var client = new window.WebTorrent()
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        Meteor.call('vids.findOne', urlParams.get('id'), function (err, result) {
            if (err) {
                console.log(err)
                return
            }
            setVid(result)
            var torrentId = result.magnetUri
            client.on('error', err => {
                console.log('[+] Webtorrent error: ' + err.message);
            });

            client.add(torrentId, (torrent) => {
                console.log('Client is downloading:', torrent.infoHash)
                console.log(torrent.files)
                torrent.on('done', () => {
                })

                torrent.on('download', function (bytes) {
                    // console.log(torrent.progress)
                    setProgress(torrent.progress * 100)
                })
                torrent.files.forEach(function (file) {
                    // Display the file by appending it to the DOM. Supports video, audio, images, and
                    // more. Specify a container element (CSS selector or reference to DOM node).
                    file.renderTo("#player")
                })


            })

        });
    }, [])

    function progressbar () {
        switch(progress){
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
                <video id="player" autoPlay width="100%" style={{ maxHeight: 500 }}></video>
                <ListHeader modifier="ios">{vid.title}</ListHeader>
                <ListTitle modifier="ios">{vid.description}</ListTitle>
            </Card>
        </Page>
    )
}
