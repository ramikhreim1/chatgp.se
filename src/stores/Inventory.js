import DragDropFile from '../Components/FileUpload';
import { observable, action, makeObservable, computed } from 'mobx';
import toast from 'react-hot-toast';

class Inventory {
    tabs = [
        {
            name: "Upload File",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>,
            Panel: DragDropFile

        },
        {
            name: "Enter a Link",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>,
        },
    ];
    @observable isUploading = false
    @observable.deep storage = {
        remaining_free_space: 0,
        current_storage_size: 0,
        total_storage: 0
    }
    @observable inventoryList = []
    @observable isinventoryListLoading = true
    @observable chat_id = null
    @observable isPublic = false
    @observable file = null
    @observable link = null

    constructor() {
        makeObservable(this);
    }

    uploadFile = async () => {
        const formdata = new FormData();
        formdata.append('file', this.file)
        formdata.append('isPublic', this.isPublic)
        let URI = "/upload"
        if (this.chat_id)
            URI = URI + `?chat_id=${this.chat_id}`
        return window.store.doc_query_api.post(URI, formdata);
    }
    crawlLink = async (link) => {
        let URI = "/crawl"
        if (this.chat_id)
            URI = URI + `?chat_id=${this.chat_id}`
        return window.store.doc_query_api.post(URI, {
            "url": link,
            // "isPublic": this.isPublic,
            "js": false,
            "depth": 1,
            "max_pages": 100,
            "max_time": 60,
            "enable_summarization": false
        });
    }

    @action setFile = (file) => this.file = file.files[0];
    @action setLink = (link) => this.link = link;
    @action setInventoryList = (list) => this.inventoryList = list;
    @action setInventoryListLoading = (list) => this.inventoryList = list;

    @action upload = async () => {
        console.log(this);
        try {
            if (!this.file && !this.link) {
                throw new Error("Kindly provide the option to upload a file or share a URL")
            }
            this.isUploading = true
            let result;
            if (this.file) {
                result = this.uploadFile(this.file)
            } else {
                result = this.crawlLink(this.link)
            }
            toast.promise(result, {
                loading: 'uploading URI',
                success: (data) => data.data?.message,
                error: (data) => data.response?.data?.detail,
            });
            await result
            this.getInventoryList()
        } catch (error) {
            console.error(error.message);
            toast.error(error.message)
        } finally {
            this.isUploading = false
        }
    }

    @action getInventoryList = async () => {
        try {
            this.isinventoryListLoading = true
            const res = await window.store.doc_query_api.get('/explore')
            this.inventoryList = res.data.documents
        } catch (error) {

        }
        finally {
            this.isinventoryListLoading = false
        }
    }

    @action getChats = async () => {
        try {
            const res = await window.store.doc_query_api.get('/chats')
            return res.data.chats
        } catch (error) {
            return []
        }
    }

    @action deleteADoc = async (doc) => {
        try {
            const res = window.store.doc_query_api.delete(`/explore/${doc.chat_id}/${doc.name}`)
            toast.promise(res, {
                loading: `Deleting document...`,
                success: () => `${doc.name} deleted successfully`,
                error: (data) => data.data?.message,
            });
            await res;
            this.inventoryList = this.inventoryList.filter(file => file.name !== doc.name && file.chat_id !== doc.chat_id)
        } catch (error) {
        }
        finally {
        }
    }



    @computed  get inventoryListComputed() { return this.inventoryList }
}

const inventoryStore = new Inventory();
export default inventoryStore;
