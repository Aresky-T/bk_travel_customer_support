export default interface ICustomer {
    id: number,
    status: string,
    email: string,
    fullName: string,
    avatarUrl?: string | null,
}