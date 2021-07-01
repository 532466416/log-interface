/**
 * @param {number} time毫秒数
 * @returns {yyyy-MM-dd hh:mm:ss}
 */
import moment from 'moment';
export function formatTime(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
}