import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import googleAnalytics from '../../services/googleAnalyticsService';
import CardTitle from './CardTitle';
import toastr from 'toastr';
import './admindash.css';
const _logger = debug.extend('BrowsersChart');

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function BrowsersChart(props) {
    const formData = { ...props.formData };

    let today = new Date().toISOString().slice(0, 10);

    const date = new Date();

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    const firstDayCurrentMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth()).toISOString().slice(0, 10);

    const [currentInfo] = useState({
        dateRanges: [
            {
                startDate: firstDayCurrentMonth,
                endDate: today,
            },
        ],
        metrics: 'ga:sessions',
        dimensions: 'ga:browser',
        order: [{ FieldName: 'ga:browser', sortOrder: 'DESCENDING' }],
    });

    const [analyticsData, setAnalyticsData] = useState([]);
    _logger(analyticsData);

    const [dimensions, setDimensions] = useState([]);
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const payload = { ...formData };
        _logger('BrowserCharts component payload', payload);
        if (props.isDates === true) {
            payload.metrics = 'ga:sessions';
            payload.dimensions = 'ga:browser';
            payload.order = [];
            payload.order.push({
                FieldName: 'ga:browser',
                sortOrder: 'DESCENDING',
            });
            payload.dateRanges = [];
            payload.dateRanges.push({
                startDate: props.initialDates.startDate,
                endDate: props.initialDates.endDate,
            });
            googleAnalytics.createAnalytics(payload).then(onGetDataSuccess).catch(onGetDataErr);
        } else {
            googleAnalytics.createAnalytics(currentInfo).then(onGetDataSuccess).catch(onGetDataErr);
        }
    }, [props.isDates]);

    const onGetDataErr = (err) => {
        _logger('get browsers data err', err);
        toastr.error('Oops, something went wrong when fetching browsers data.');
    };

    const onGetDataSuccess = (response) => {
        _logger('get browser data success', response.item.reports);
        const reports = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.analyticsData = reports.map(mappedData);
            return ps;
        });
    };

    const mappedData = (analytics) => {
        _logger('BrowsersChart mappedData', analytics.data.rows);
        const rows = analytics.data.rows;
        setDimensions(rows.map((d) => d.dimensions));
        setMetrics(rows.map((m) => parseInt(m.metrics[0].values)));
    };

    const radarChartData = {
        labels: dimensions,
        datasets: [
            {
                label: 'Browsers',
                backgroundColor: 'rgba(57,175,209,0.2)',
                borderColor: '#39afd1',
                pointBackgroundColor: '#39afd1',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#39afd1',
                data: metrics,
            },
        ],
    };

    const radarChartOpts = {
        maintainAspectRatio: false,
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <CardTitle
                        containerClass="admin-browserschart mb-3"
                        title="Sessions By Browser"
                        menuItems={[{ label: 'Refresh Report' }, { label: 'Export Report' }]}
                    />
                    <div className="mb-5 mt-4 chartjs-chart" style={{ height: '320px', maxWidth: '320px' }}>
                        <Radar data={radarChartData} options={radarChartOpts} />
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

BrowsersChart.propTypes = {
    formData: PropTypes.shape({
        metrics: PropTypes.string.isRequired,
        dimensions: PropTypes.string.isRequired,
    }),
    isDates: PropTypes.bool,
    initialDates: PropTypes.shape({
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
    }),
};

export default BrowsersChart;
