/**
 * 文件说明: 时光详情相关接口
 * 详细描述: 采用模块名+接口名命名接口,与接口文档保持一致.
 * 创建者: 卢淮建
 * 创建时间: 15/09/21
 * 变更记录:
 */
import Q from 'q';
import request from 'superagent';
import HttpClient from '../assets/src/redux/utils/httpClient';
import Config from '../config';



/**
 * 注册用户
 * @param req
 * @returns {Promise}
 */
export function apiRegisterUser(req) {

	let defer = Q.defer();

	HttpClient.post('/auth/register', req)
			.then(res => {
				defer.resolve(res.data);
			}, err => {
				defer.reject(err);
			});

	return defer.promise;

}

/**
 * 登录用户
 * @param req
 * @returns {Promise}
 */
export function apiLoginUser(req) {

	let defer = Q.defer();

	HttpClient.post('/auth/login', req, {
		})
		.then(res => {
			defer.resolve(res.data);
		}, err => {
			defer.reject(err);
		});

	return defer.promise;

}

/**
 * 检查用户名
 * @param req
 * @returns {*}
 */
export function apiCheckUnique(req) {

	let defer = Q.defer();

	HttpClient.post('/auth/checkusername', req)
		.then(res => {
			defer.resolve(res.data);
		}, err => {
			defer.reject(err);
		});

	return defer.promise;

}


/**
 * 忘记密码
 * @param req
 * @returns {*}
 */
export function apiForgetPassword(req) {
	let defer = Q.defer();

	HttpClient.post('/auth/forget', req)
			.then(res => {
				defer.resolve(res.data);
			}, err => {
				defer.reject(err);
			});

	return defer.promise;

}

/**
 * 重发激活邮箱
 * @param req
 * @returns {*}
 */
export function apiResendEmail(req) {

	let defer = Q.defer();

	HttpClient.get('/auth/resendemail', req)
			.then(res => {
				defer.resolve(res.data);
			}, err => {
				defer.reject(err);
			});

	return defer.promise;

}

/**
 * 更换帐户邮箱
 * @param req
 * @returns {*}
 */
export function apiChangeEmail(req) {

	let defer = Q.defer();

	HttpClient.post('/auth/changeemail', req)
			.then(res => {
				defer.resolve(res.data);
			}, err => {
				defer.reject(err);
			});

	return defer.promise;

}
