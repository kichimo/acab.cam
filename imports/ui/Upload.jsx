import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, Card, ToolbarButton, Input, Button, ProgressBar, Dialog } from 'react-onsenui'
import Resizer from 'react-image-file-resizer';
import { gzip, ungzip } from 'node-gzip';
import { connect } from "react-redux";
import ffmpeg from "ffmpeg.js/ffmpeg-mp4.js";
import BMF from 'browser-md5-file';

const mapStateToProps = (state) => {
    return {
        client: state.webtorrentreducer.client,
    };
}

export default connect(mapStateToProps)(
    Upload
);

function Upload({ showMenu, client }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [fileSelector, setFileSelector] = useState()
    const [previewImg, setPreviewImg] = useState()
    const [file, setFile] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    
    useEffect(() => {
        setFileSelector(buildFileSelector())
    }, [])


    function buildFileSelector() {
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', 'video/*');
        return fileSelector;
    }

    function handleFileSelect() {
        fileSelector.click();
    }

    function checkRequirement() {
        if (file == null) {
            // console.log("no file is selected")
            setErrorMessage("no file is selected")
            setOpenDialog(true)
            return
        }
        if (title == "") {
            // console.log("no title")
            setErrorMessage("Title cannot be empty")
            setOpenDialog(true)
            return
        }
        if (description == "") {
            // console.log("no description")
            setErrorMessage("Description cannot be empty")
            setOpenDialog(true)
            return
        }
    }

    function uploadFailed(){
        setUploading(false)
        setUploaded(false)
        setErrorMessage("Process video failed.")
        setOpenDialog(true)
    }

    // function seed() {
    //     checkRequirement()
    //     client.seed(file, function (torrent, err) {
    //         if (err) {
    //             console.log(err)
    //         }
    //         console.log('Client is seeding:', torrent.magnetURI)
    //         Meteor.call('vids.insert', title, description, torrent.magnetURI, previewImg, function (err, result) {
    //             if (err) {
    //                 console.log(err)
    //                 setUploading(false)
    //                 return
    //             }
    //             console.log(result)
    //             setUploading(false)
    //             setUploaded(true)
    //         });
    //     })
    // }

    function transcodeAndSeed() {
        checkRequirement()
        setUploading(true)
        const bmf = new BMF();
        file.arrayBuffer().then((buffer) => {
            var fileData = new Uint8Array(buffer);

            // Encode test video to VP8.
            var result = ffmpeg({
                MEMFS: [{ name: file.name, data: fileData }],
                arguments: ["-i", file.name,"-c","copy", "out.mp4"],
                // Ignore stdin read requests.
                stdin: function () { },
            });

            var out = result.MEMFS[0];
            var blob = new Blob([out.data], { "type": "video/mp4" });
            bmf.md5(
                blob,
                (err, md5) => {
                    if (err) {
                        console.log('err:', err);
                        uploadFailed()
                        return
                    }
                    var mp4file = new File([blob], md5 + ".mp4");
                    client.seed(mp4file, function (torrent, err) {
                        if (err) {
                            console.log(err)
                            uploadFailed()
                            return
                        }
                        // console.log('Client is seeding:', torrent.magnetURI)
                        Meteor.call('vids.insert', title, description, torrent.magnetURI, previewImg, function (err, result) {
                            if (err) {
                                console.log(err)
                                uploadFailed()
                                return
                            }
                            if (result) {
                                setUploading(false)
                                setUploaded(true)
                            }
                        });
                    })
                })
        })
    }

    //return a promise that resolves with a File instance
    function urltoFile(url, filename, mimeType) {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
        return (fetch(url)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
        );
    }

    //handle the uploaded file
    function fileChangedHandler(event, type) {
        var fileInput = false
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            //read file and produce a preview image
            setFile(event.target.files[0])
            var file = event.target.files[0];
            var fileReader = new FileReader();
            fileReader.onload = function () {
                var blob = new Blob([fileReader.result], { type: file.type });
                var url = URL.createObjectURL(blob);
                var video = document.createElement('video');
                var timeupdate = function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata', function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                var snapImage = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    var image = canvas.toDataURL("image/png");
                    urltoFile(image, 'a.png')
                        .then(function (imgfile) {
                            Resizer.imageFileResizer(
                                imgfile,
                                500,
                                500,
                                'PNG',
                                10,
                                0,
                                uri => {
                                    // console.log(uri)
                                    setPreviewImg(uri)
                                    // gzip(uri)
                                    //     .then((compressed) => {
                                    //         var b64encoded = btoa(String.fromCharCode.apply(null, compressed));
                                    //         console.log(b64encoded)
                                    //     })
                                },
                                'base64'
                            );
                        })
                    return true;
                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.play();
            };
            fileReader.readAsArrayBuffer(file);
        }
    }


    function renderDialog(){
        return(<Dialog onCancel={() => { setOpenDialog(false) }}
        isOpen={openDialog}
        cancelable>
        <Page>
            <Card style={{ height: "80%", textAlign: "center" }}>
                <div style={{ marginBottom: 5 }}>
                    {errorMessage}
                </div>
                <Button style={{
                    display: "block",
                    margin: "auto",
                    textAlign: "center",
                }}
                    ripple
                    modifier="quiet"
                    onClick={() => { setOpenDialog(false) }}>
                    Cancel
            </Button>
            </Card>
        </Page>
    </Dialog>)
    }

    if (uploaded) {
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
                Your video is being seeded now! If you want to keep the video available, dont close this tab to keep seeding it.
            </Card>
            {renderDialog()}
        </Page>
    }
    if (uploading) {
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
                <ProgressBar indeterminate />
                We are processing your video, please wait and dont leave this page.
            </Card>
            {renderDialog()}
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
            <Card>
                <Input
                    style={{ width: "100%", marginBottom: 30 }}
                    value={title}
                    modifier='underbar'
                    onChange={(event) => { setTitle(event.target.value) }}
                    placeholder='Title' />
                <Input
                    style={{ width: "100%", marginBottom: 30 }}
                    value={description}
                    onChange={(event) => { setDescription(event.target.value) }}
                    modifier='underbar'
                    placeholder='Description' />
                <img src={previewImg} />
                <Button onClick={() => {
                    fileSelector.onchange = (event) => { fileChangedHandler(event) };
                    handleFileSelect();
                }}
                    modifier="large--cta"
                    style={{ marginBottom: 30 }}
                >
                    Select file
                </Button>
                <Button modifier="large--cta"
                    style={{ marginBottom: 30 }}
                    onClick={() => {
                        // seed()
                        transcodeAndSeed()
                    }}>
                    <Icon icon="upload"></Icon>{" Upload"}
                </Button>

                {/* <Button modifier="large--cta" onClick={() => {

                    test()
                }}>
                    <Icon icon="upload"></Icon>{" Test"}
                </Button> */}
            </Card>
            {renderDialog()}
        </Page>
    )
}
