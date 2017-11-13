import React from 'react';
import { createPortal, render, unmountComponentAtNode } from 'react-dom';

const hasCreatePortal: boolean = !!createPortal;

export interface renderToProps {
    mounted: boolean;
}

export default (dom?: HTMLElement | string) => <P>(
    target: React.SFC<P> | React.ComponentClass<P>,
): React.ComponentClass<P & renderToProps> => {
    return class RenderTo extends React.Component<P & renderToProps> {
        private container: Element | null;

        componentDidMount() {
            if (hasCreatePortal) {
                return;
            }
            this.setContainer();
            this.renderToNode();
        }

        componentWillUnmount() {
            if (!hasCreatePortal) {
                this.removeFromNode();
            }
            if (!dom) {
                document.body.removeChild(this.container!);
            }
        }

        render(): React.ReactPortal | null {
            if (!hasCreatePortal) {
                return null;
            }
            const { mounted, ...props }: any = this.props;
            return createPortal(
                React.createElement(target, props, this.props.children),
                document.body,
            );
        }

        private setContainer() {
            if (!dom) {
                this.container = document.createElement('div');
                document.body.appendChild(this.container);
            } else if (typeof dom === 'string') {
                this.container = document.querySelector(dom);
            } else {
                this.container = dom;
            }
        }

        private renderToNode() {
            const { mounted, ...props }: any = this.props;
            render(
                React.createElement(target, props, this.props.children),
                this.container,
            );
        }

        private removeFromNode() {
            unmountComponentAtNode(this.container!);
        }
    };
};
