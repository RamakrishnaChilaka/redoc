import * as React from 'react';
import styled from '../../styled-components';
import { SecurityRequirements } from '../SecurityRequirement/SecuirityRequirement';

import { observer } from 'mobx-react';

import { Badge, ConsoleButton, DarkRightPanel, FlexLayoutReverse, H2, MiddlePanel, Row, Toggle } from '../../common-elements';

import { OptionsContext } from '../OptionsProvider';

import { ShareLink } from '../../common-elements/linkify';
import { ConsoleViewer } from '../Console/ConsoleViewer';
import { Endpoint } from '../Endpoint/Endpoint';
import { Markdown } from '../Markdown/Markdown';
import { Parameters } from '../Parameters/Parameters';
import { RequestSamples } from '../RequestSamples/RequestSamples';
import { ResponsesList } from '../Responses/ResponsesList';
import { ResponseSamples } from '../ResponseSamples/ResponseSamples';

import { OperationModel as OperationType } from '../../services/models';

const OperationRow = Row.extend`
  backface-visibility: hidden;
  contain: content;

  overflow: hidden;
  position: relative;

  &:after {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: block;
    content: '';
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

export interface OperationProps {
  operation: OperationType;
}

export interface OperationState {
  executeMode: boolean;
}

@observer
export class Operation extends React.Component<OperationProps, OperationState> {

  constructor(props) {
    super(props);
    this.state = {
      executeMode: false,
    };
  }

  onConsoleClick = () => {
    this.setState({
      executeMode: !this.state.executeMode,
    });
  }
  /*
  activate = (item: IMenuItem) => {
    this.props.menu.activateAndScroll(item, true);
    setTimeout(() => {
      if (this._updateScroll) {
        this._updateScroll();
      }
    });
  };
  */

  render() {
    const { operation } = this.props;

    const { name: summary, description, deprecated } = operation;
    const { executeMode } = this.state;
    const consoleButtonLabel = (executeMode) ? 'Hide Console' : 'Show Console';
    return (
      <OptionsContext.Consumer>
        {options => (
          <OperationRow>
            <MiddlePanel>
              <H2>
                <ShareLink href={'#' + operation.id} />
                {summary} {deprecated && <Badge type="warning"> Deprecated </Badge>}
              </H2>
              {options.enableConsole &&
                <FlexLayoutReverse>
                  <ConsoleButton onClick={this.onConsoleClick}>{consoleButtonLabel}</ConsoleButton>
                </FlexLayoutReverse>
              }
              {options.pathInMiddlePanel && <Endpoint operation={operation} inverted={true} />}
              {description !== undefined && <Markdown source={description} />}
              <SecurityRequirements securities={operation.security} />
              <Parameters parameters={operation.parameters} body={operation.requestBody} />
              <ResponsesList responses={operation.responses} />
            </MiddlePanel>
            <DarkRightPanel>
              {!options.pathInMiddlePanel && <Endpoint operation={operation} />}
              {executeMode &&
                <div>
                  <ConsoleViewer operation={operation} />
                </div>
              }
              {!executeMode &&
                <RequestSamples operation={operation} />
              }
              {!executeMode &&
                <ResponseSamples operation={operation} />
              }
            </DarkRightPanel>
          </OperationRow>
        )}
      </OptionsContext.Consumer>
    );
  }
}
