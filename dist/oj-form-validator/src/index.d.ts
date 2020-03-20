import "oj-event";
import Component from "oj-component";
export interface IInput {
    element: HTMLInputElement;
    label?: HTMLElement;
    error?: string | null;
    valid?: boolean;
}
export interface IOptions {
    post?: boolean;
}
export default class FormValidator extends Component {
    static mount(options?: IOptions): FormValidator[];
    private submitButton;
    private inputs;
    private post;
    constructor(root: HTMLFormElement, options?: IOptions);
    initialize(): void;
    validateForm(): boolean;
    validate(input: IInput): boolean;
    private handleInputElements();
    private handleChanges(input);
    private handlePostResponse(response);
}
