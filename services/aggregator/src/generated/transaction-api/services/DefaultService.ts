/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * @param startDate Start date in ISO 8601 format
     * @param endDate End date in ISO 8601 format
     * @returns any List of transactions
     * @throws ApiError
     */
    public static getTransactions(
        startDate: string,
        endDate: string,
    ): CancelablePromise<{
        items?: Array<{
            id?: string;
            userId?: string;
            createdAt?: string;
            type?: 'payout' | 'spent' | 'earned';
            amount?: number;
        }>;
        meta?: {
            totalItems?: number;
            itemCount?: number;
            itemsPerPage?: number;
            totalPages?: number;
            currentPage?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
}
