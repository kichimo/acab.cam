import React, { useState, useEffect } from 'react'
import { Page, Toolbar, Icon, Card, ToolbarButton, Input, Button, ProgressCircular, Dialog } from 'react-onsenui'
import Resizer from 'react-image-file-resizer';
import { gzip, ungzip } from 'node-gzip';
import { connect } from "react-redux";

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
    const [file, setFile] = useState()
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

    function seed() {
        client.seed(file, function (torrent, err) {
            if (err) {
                console.log(err)
            }
            console.log('Client is seeding:', torrent.magnetURI)
            Meteor.call('vids.insert', title, description, torrent.magnetURI, previewImg, function (err, result) {
                if (err) {
                    console.log(err)
                    setUploading(false)
                    return
                }
                console.log(result)
                setUploading(false)
                setUploaded(true)
            });
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
                Your video is being seeded now! If you want to keep the video available, dont close the browser and keep seeding it.
            </Card>
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
                <Button modifier="large--cta" onClick={() => {
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
                    setUploading(true)
                    seed()
                }}>
                    <Icon icon="upload"></Icon>{" Upload"}
                </Button>
            </Card>
            <Dialog onCancel={()=>{setOpenDialog(false)}}
                isOpen={openDialog}
                 cancelable>
                <Page>
                    <Card style={{height:"80%", textAlign: "center"}}>
                        <div style={{marginBottom: 5}}>
                        {errorMessage}
                        </div>
                    <Button style={{
                        display: "block",
                        margin: "auto",
                        textAlign: "center",
                        }}
                        ripple
                        modifier="quiet"
                        onClick={()=>{setOpenDialog(false)}}>
                        Cancel
                    </Button>
                    </Card>
                </Page>
            </Dialog>
        </Page>
    )
}
