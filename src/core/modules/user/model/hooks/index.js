export function saveFullNameHook() {
    if (this.profile?.firstName && this.profile?.lastName) {
        this.profile.fullName = `${this.profile.firstName} ${this.profile.lastName}`;
    }
}
