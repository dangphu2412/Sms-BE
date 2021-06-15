export function saveFullNameHook() {
    this.profile.fullName = `${this.profile.firstName} ${this.profile.lastName}`;
}
