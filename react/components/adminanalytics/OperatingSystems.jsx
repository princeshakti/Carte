import React, { useEffect, useState } from 'react';
import googleAnalytics from '../../services/googleAnalyticsService';
import debug from 'sabio-debug';
import Chart from 'react-apexcharts';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CardTitle from './CardTitle';
import toastr from 'toastr';

const _logger = debug.extend('OperatingSystem');

function OperatingSystems(props) {
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
        dimensions: 'ga:operatingSystem',
        order: [{ FieldName: 'ga:operatingSystem', sortOrder: 'DESCENDING' }],
    });

    const [analyticsData, setAnalyticsData] = useState([]);
    const [totalOS, setTotalOS] = useState([]);

    const [dimensions, setDimensions] = useState([]);
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const payload = { ...formData };
        _logger('OS component payload', payload);
        if (props.isDates === true) {
            payload.metrics = 'ga:sessions';
            payload.dimensions = 'ga:operatingSystem';
            payload.order = [];
            payload.order.push({
                FieldName: 'ga:operatingSystem',
                sortOrder: 'DESCENDING',
            });
            payload.dateRanges = [];
            payload.dateRanges.push({
                startDate: props.initialDates.startDate,
                endDate: props.initialDates.endDate,
            });
            googleAnalytics.createAnalytics(payload).then(onGetOSSuccess).catch(onGetOSErr);
        } else {
            googleAnalytics.createAnalytics(currentInfo).then(onGetOSSuccess).catch(onGetOSErr);
        }
    }, [props.isDates]);

    const onGetOSErr = (err) => {
        _logger('get err ->', err);
        toastr.error('Oops, something went wrong when fetching OS data.');
    };

    const onGetOSSuccess = (response) => {
        _logger('OS get resp ->', response.item.reports);
        const reports = response.item.reports;
        setAnalyticsData((prevState) => {
            const ps = { ...prevState };
            ps.arrayOfData = reports.map(mappedData);
            return ps;
        });
    };

    const mappedData = (analytics) => {
        _logger('OS mappedData', analytics.data.rows);
        const data = analytics.data.rows;
        const totals = analytics.data.totals;
        setDimensions(data.map((d) => d.dimensions));
        setMetrics(data.map((m) => parseInt(m.metrics[0].values)));

        setTotalOS(totals[0].values[0]);

        let mappedCols = data.map((data, index) => {
            return (
                <div className="col-6" key={index}>
                    <h4 className="font-weight-normal">
                        <span>{data.metrics[0].values[0]}</span>
                    </h4>
                    <p className="text-muted mb-0">{data.dimensions[0]}</p>
                </div>
            );
        });
        return mappedCols;
    };

    const apexOpts = {
        grid: {
            padding: {
                left: 0,
                right: 0,
            },
        },
        chart: {
            height: 278,
            type: 'radialBar',
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'OS',
                        formatter: function (w) {
                            w = totalOS;

                            return w;
                        },
                    },
                },
            },
        },
        colors: ['#727cf5', '#0acf97', '#fa5c7c', '#ffbc00'],
        labels: dimensions,
    };

    const apexData = metrics;

    return (
        <>
            <Card>
                <Card.Body>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title="Sessions by Operating System"
                        menuItems={[{ label: 'Refresh Report' }, { label: 'Export Report' }]}
                    />

                    <Chart
                        options={apexOpts}
                        series={apexData}
                        type="radialBar"
                        height="270px"
                        className="apex-charts mt-3"
                    />

                    <div className="row text-center mt-2">{analyticsData.arrayOfData}</div>
                </Card.Body>
            </Card>
        </>
    );
}

OperatingSystems.propTypes = {
    formData: PropTypes.shape({
        metrics: PropTypes.string.isRequired,
        dimensions: PropTypes.string.isRequired,
    }),
    isDates: PropTypes.bool.isRequired,
    initialDates: PropTypes.shape({
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
    }),
};

export default OperatingSystems;
