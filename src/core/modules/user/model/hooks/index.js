export function saveFullNameHook() {
    if (this.profile?.firstName && this.profile?.lastName) {
        this.profile.fullName = `${this.profile.firstName} ${this.profile.lastName}`;
    }
    if (this._update.profile?.firstName || this._update.profile?.lastName) {
        this._update.profile.fullName = `${this._update.profile.firstName} ${this._update.profile.lastName}`;
    }
}
