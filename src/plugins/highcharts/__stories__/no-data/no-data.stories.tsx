import React from 'react';
import {Meta, Story} from '@storybook/react';
import {ChartKit} from '../../../../components/ChartKit';
import {noData, filledData} from '../../mocks/no-data';
import {ChartStory} from '../components/ChartStory';
import {Button} from '@gravity-ui/uikit';
import {ChartKitRenderError} from '../../../../types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default {
    title: 'Plugins/Highcharts/NoData',
    component: ChartKit,
} as Meta;

const Template: Story = () => {
    const [data, setData] = React.useState(noData);

    const handleUpdateData = React.useCallback(() => {
        setData(filledData);
    }, []);

    const renderError: ChartKitRenderError = React.useCallback(
        (opts) => {
            const graphs = get(data.data, 'graphs');
            if (!graphs) {
                opts.resetError();
            }

            if (graphs.every((graph: {data: unknown[]}) => !isEmpty(graph.data))) {
                opts.resetError();
            }

            return <div>{opts.message}</div>;
        },
        [data],
    );

    return (
        <div>
            <div style={{marginBottom: 12}}>
                <Button onClick={handleUpdateData}>Add data</Button>
            </div>
            <ChartStory data={data} visible={true} renderError={renderError} />
        </div>
    );
};

export const NoData = Template.bind({});
