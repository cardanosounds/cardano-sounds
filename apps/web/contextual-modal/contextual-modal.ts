import { useCallback } from 'react';
import { NextRouter, useRouter } from 'next/router';
import stringify from 'qs-stringify';
import { ParsedUrlQuery } from 'querystring';
export const RETURN_HREF_QUERY_PARAM = '_UCR_return_href';

/**
 * During contextual routing browser URL will be controlled by Next Router's "as" prop
 * while the page actually rendered is defined by Next Router's "href" prop.
 *
 * During contextual navigation Next Router's behaves as follows:
 * router.asPath:   /item/3               reflects current URL and updates at each page change
 * router.pathname: /search/[terms]       stay the same as long as initial page doesn't change
 * router.query:    {"terms": "foo-bar"}  same as above
 */
export function useContextualRouting(): { 
        returnHref: string, 
        makeContextualHref:(extraQueryParams: { [key: string]: any }) => string 
    } {

    const router: NextRouter = useRouter();
    const returnHrefQueryParam: string 
      = Array.isArray(router.query[RETURN_HREF_QUERY_PARAM]) 
      ? router.query[RETURN_HREF_QUERY_PARAM][0] 
      : router.query[RETURN_HREF_QUERY_PARAM] ? router.query[RETURN_HREF_QUERY_PARAM].toString() : "undefined"
      
    const watchedQuery: ParsedUrlQuery = Object.assign({}, router.query)
    delete watchedQuery[RETURN_HREF_QUERY_PARAM]
    /*
     * After a page refresh there is no RETURN_HREF_QUERY_PARAM in router.query
     * RETURN_HREF_QUERY_PARAM is only available in those history entries where
     * contextual navigation is enabled (or WAS enabled in case history.back() is triggered)
     */
    const returnHref: string = returnHrefQueryParam ?? router.asPath
    // @NOTE JSON.stringify might be replaced with any hashing solution
    const queryHash: string = JSON.stringify(watchedQuery)
    const makeContextualHref: (extraQueryParams: { [key: string]: any }) => string = useCallback(
      (extraParams) =>
        router.pathname +
        '?' +
        stringify(
          Object.assign({}, router.query, extraParams, {
            [RETURN_HREF_QUERY_PARAM]: returnHref,
          })
        ),
      [queryHash, returnHref]
  );

  return { returnHref, makeContextualHref }
}
