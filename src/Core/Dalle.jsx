import React, { Component } from 'react';
import FileSaver from 'file-saver';
import { Helmet } from "react-helmet";
import Body from '../Components/Body'
import { Route, Switch, withRouter } from 'react-router-dom'
import { observable, makeObservable, computed, } from 'mobx'
import { observer, inject, } from 'mobx-react'
import CreatePost from '../Components/CreatePost';
import DalleHome from '../Components/DalleHome';
import Footer from '../Components/Footer';



@inject('store')
@observer
class Tool extends Component {

    @observable tool = {}
    @observable.deep prompts = []
    @observable error = ""
    @observable loading = false
    @observable prompt = ""
    @observable allPosts = []
    @observable searchText = ""
    @observable photo = ""

    countdown = []

    constructor(props) {
        super(props)
        makeObservable(this)
        this.getRandomPrompt.bind(this)
        this.tool = this.props.store.getToolByUrl(this.props.location.pathname)
        // console.log(this.tool);
        if (!this.tool) {
            window.location.href = '/';
        } else {
            this.prompts = [...this.tool.prompts]
            // console.log(this.prompts);
        }
    }
    @computed get posts() {
        return this.allPosts.filter((item) => item.name.toLowerCase().includes(this.searchText.toLowerCase()) || item.prompt.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    setPhoto = (photo) => this.photo = photo
    setPromt = (sdcv) => this.prompt = sdcv


    getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * this.prompts[0].surpriseMePrompts.length);
        const randomPrompt = this.prompts[0].surpriseMePrompts[randomIndex];

        if (randomPrompt === this.prompt) return this.getRandomPrompt();

        this.prompt = randomPrompt;
    }
    downloadImage = (_id, photo) => {
        FileSaver.saveAs(photo, `download-${_id}.jpg`);
    }

    @computed get isGenerateButtonDisabled() {
        if (this.loading) {
            return true
        }
        return false
    }

    checkOutput = output => output ? output.replace(/^\s+|\s+$/g, '') : undefined;


    render() {

        return (
            <>
                <Helmet>
                    <title>{`DALL·E 2`}</title>
                    <meta name="description"
                        content="DALL·E 2 is an AI system that can create realistic images and art from a description in natural language." />
                </Helmet>
                <Body className="scrollbar-none sm:p-8 px-4 py-8 w-full" style={{ background: "#fafafc", minHeight: "100vh" }}>
                    <Switch>
                        <Route exact path="/ai/dalle/">
                            <DalleHome api={this.props.store.api} />
                        </Route>
                        <Route path="/ai/dalle/create/">
                            <CreatePost setPrompt={this.setPromt} api={this.props.store.api} tool={this.tool} getRandomPrompt={this.getRandomPrompt} prompt={this.prompt} photo={this.photo} setPhoto={this.setPhoto} />
                        </Route>
                    </Switch>
                </Body>
                <Footer />
            </>
        )
    }
}



export default withRouter(Tool)