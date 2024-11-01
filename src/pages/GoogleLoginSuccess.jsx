import { observer, inject } from 'mobx-react'
import React from "react";

const GoogleLoginSuccess = observer(() => {

    React.useEffect(() => {
        (async () => {
            window.store.loginWithDataTokenAndProfile(await window.store.refreshTokenAndProfile())
        })()
    },[])
    return (
        <div>Redirecting...</div>
    )
})
export default inject('store')(GoogleLoginSuccess)