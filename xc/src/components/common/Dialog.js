import React, {PureComponent} from 'react';

import './Dialog.scss'

class Dialog extends PureComponent {
    render() {
        const {
            show,
            title,
            msg,
            cancel,
            confirm,
            cancelLabel,
            confirmLabel,
        } = this.props;
        return (
            show ? <div id="dialog-component">
                <div className="content">
                    <h1>{title}</h1>
                    <p>{msg}</p>
                    <aside>
                        <button onClick={cancel && cancel()}>
                            {cancelLabel ? cancelLabel : '取消'}
                        </button>
                        <button onClick={confirm && confirm()}>
                            {confirmLabel ? confirmLabel : '确定'}
                        </button>
                    </aside>
                </div>
            </div> : ''
        );
    }
}

export default Dialog;