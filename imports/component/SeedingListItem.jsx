import React, { useState, useEffect } from 'react'
import { ListItem, Icon } from 'react-onsenui'
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        client: state.webtorrentreducer.client
    };
}


export default connect(mapStateToProps)(
    SeedingListItem
);

function SeedingListItem({ vid, client }) {

    const [seedingState, setSeedingState] = useState(false)
    const [uploadSpeed, setUploadSpeed] = useState(0)
    const [downloadSpeed, setDownloadSpeed] = useState(0)

    useEffect(() => {
        let mounted = true
        const interval = setInterval(() => {
            torrentId = vid.magnetUri
            Ctorrent = client.get(torrentId)
            if (Ctorrent != null) {
                setSeedingState(true)
                Ctorrent.on('upload', function (bytes) {
                    if (mounted) {
                        setUploadSpeed(Ctorrent.uploadSpeed)
                    }
                })
                Ctorrent.on('download', function (bytes) {
                    if (mounted) {
                        setDownloadSpeed(Ctorrent.downloadSpeed)
                    }
                })
            } else {
                setSeedingState(false)
            }
            if (seedingState) {
                if (torrent != null) {
                    if (torrent.downloadSpeed == 0) {
                        setDownloadSpeed(0)
                    }
                    if (torrent.uploadSpeed == 0) {
                        setUploadSpeed(0)
                    }
                }
            }
        }, 5000);

        torrentId = vid.magnetUri
        torrent = client.get(torrentId)
        if (torrent != null) {
            setSeedingState(true)
            setUploadSpeed(0)
            setDownloadSpeed(0)
            torrent.on('upload', function (bytes) {
                if (mounted) {
                    setUploadSpeed(torrent.uploadSpeed)
                }
            })
            torrent.on('download', function (bytes) {
                if (mounted) {
                    setDownloadSpeed(torrent.downloadSpeed)
                }
            })
        }

        return () => {
            clearInterval(interval)
            mounted = false
        };
    }, []);

    function startseeding() {
        setSeedingState(true)
        setUploadSpeed(0)
        setDownloadSpeed(0)
        var torrentId = vid.magnetUri
        Ctorrent = client.get(torrentId)
        if (Ctorrent == null) {
            client.on('error', err => {
                console.log('[+] Webtorrent error: ' + err.message);
            });

            client.add(torrentId, (torrent) => {
                console.log('Client is downloading:', torrent.infoHash)
            })
        }
    }
    function stopSeeding() {
        setSeedingState(false)
        setUploadSpeed(0)
        setDownloadSpeed(0)
        var torrentId = vid.magnetUri
        Ctorrent = client.get(torrentId)
        if (Ctorrent != null) {
            client.remove(torrentId, () => {
                console.log('stop seeding ' + vid.title)
            })
        }
    }

    if (seedingState) {
        return <ListItem
            tappable
            style={{
                color: "grey"
            }}
            onClick={() =>
                stopSeeding()
            }
        >
            <div className="left">{vid.title}</div>
            <div className="center"></div>
            <div className="right">
                <Icon icon="arrow-down" />
                {(downloadSpeed / 1024).toFixed(2)} kb/s
            <Icon icon="arrow-up" />
                {(uploadSpeed / 1024).toFixed(2)} kb/s
            </div>
        </ListItem>
    }
    return <ListItem
        tappable
        onClick={() => {
            startseeding()
        }}
    >
        <div className="left">{vid.title}</div>
        <div className="center"></div>
        <div className="right">Not Seeding</div>

    </ListItem>
}
