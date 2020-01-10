import React, { useState, useEffect } from 'react'
import * as Ons from 'react-onsenui'
import { Route } from 'react-router'

function Layout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    function hide() {
        setIsOpen(false)
    }
    function show() {
        setIsOpen(true)
    }


    function loadPage(history, page) {
        hide()
        history.push(page)
    }
    return (<>
        <Ons.Splitter>
            <Ons.SplitterSide side='left' width={220} collapse={true} swipeable={true} isOpen={isOpen} onClose={hide} onOpen={show}>
                <Ons.Page>
                    <Ons.List>
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { loadPage(history, "/") }} tappable>Main</Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"UPLOAD"} onClick={() => { loadPage(history, "/upload") }} tappable>Upload</Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"SEEDING"} onClick={() => { loadPage(history, "/seeding") }} tappable>Seeding</Ons.ListItem>
                        )} />
                    </Ons.List>
                </Ons.Page>
            </Ons.SplitterSide>
            <Ons.SplitterContent>
                {React.cloneElement(children, { showMenu: show })}
            </Ons.SplitterContent>
        </Ons.Splitter>
    </>)
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default Layout