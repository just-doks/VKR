import {makeAutoObservable} from 'mobx'

export default class clientStore {
    constructor() {
        this._isAuth = false
        this._isAdmin = false
        this._user = {}
        makeAutoObservable(this)
    }
    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        const role = user?.role ?? ''
        if (role) {
            if (role === 'ADMIN') {
                this._isAdmin = true
            }
            this._user = user
        }
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }

    get isAdmin() {
        return this._isAdmin // false
    }

}