/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LogEvent } from "./log-service";

/** Sample logs input to use for testing and */
export function LOGS(){
const logs =
  [
    {
      id: 1,
      eventId: "network_request_f2b02bf8-f69b-45ba-b269-c83d6cdc7728",
      type: "sdk_mad",
      timestamp: 6987,
      absoluteTime: "2024-09-10T15:17:44.986Z",
      gmaParams: {},
    },
    {
      id: 2,
      eventId: "network_request_a98e173b-ee79-4fc0-85a5-cd6c73617afe",
      type: "sdk_mad",
      timestamp: 7398,
      absoluteTime: "2024-09-10T15:17:45.397Z",
      gmaParams: {},
    },
    {
      id: 3,
      eventId: "network_request_78d1b611-90a8-48ba-982e-9d9ac9a9eb38",
      type: "sdk_init",
      timestamp: 7572,
      absoluteTime: "2024-09-10T15:17:45.571Z",
      gmaParams: {},
    },
    {
      id: 4,
      eventId: "network_request_80243b85-4298-407b-b79c-c7e0ede70ac3",
      type: "sdk_mad",
      timestamp: 7654,
      absoluteTime: "2024-09-10T15:17:45.653Z",
      gmaParams: {},
    },
    {
      id: 5,
      eventId: "network_request_1faf5a4b-64cb-43a0-ba09-a0076b93442a",
      type: "sdk_mad",
      timestamp: 7808,
      absoluteTime: "2024-09-10T15:17:45.807Z",
      gmaParams: {},
    },
    {
      id: 6,
      eventId: "network_request_d44f62d2-49ed-4a8c-b4da-adebfb13d926",
      type: "sdk_mad",
      timestamp: 7814,
      absoluteTime: "2024-09-10T15:17:45.813Z",
      gmaParams: {},
    },
    {
      id: 7,
      eventId: "network_request_e7e55843-0ecf-4c07-aa52-b62360b54f00",
      type: "ad_request",
      timestamp: 8390,
      absoluteTime: "2024-09-10T15:17:46.389Z",
      gmaParams: {
        request_url:
          "https://pubads.g.doubleclick.net/gampad/ads?submodel=Pixel%206&adid_p=1&format=411x64_as&omid_v=a.1.4.10-google_20240110&dv=243220703&ev=23.3.0&gl=FR&hl=fr&js=afma-sdk-a-v243220999.242402000.1&lv=242402501&ms=CugDmsA_ATEaPwF_uwiQE0A0AKnJ7U0jPVzKHeFdLpuue_6_bqb-39cooFDVKsIqLr_hSPzg-WyOkobEGUWWzzfKvjmy3kIIBxKfAywklo6o9AhAS1emNDA64Ni5nPffSBUwJX1l6efFbpqpGyMYanf1GSZl-rDq0w-5iMCAebyhJiTrs23wt919IFyOCDNKk4CnlsusTJir8j-Hroklg-f3hhx7ol2MaySC8m1M4Z50BmbsNcN0guy1PLg7KMA5k8gX9sX9PGQYXVLPgbs8PFd1cwF1b1kqAbpe6JYFo7jJKIL3oZLAeDjVRgRw_6GqP2Ar2giYRVd5KSWk-hvddfHcLsA9BxMonV32152U-G0xtjQ3RL9V1pum7340XIc2_-82-jleVlV_aJfdXjptj8N4CATHxdQQirNCtPbqbGzzzU60A52O3FUwM77Z5O2nNbpkFc134uB7LEhiY5nxiZXxSFgaD7LbCKy9NKSsZ63T2RAI0ELF99Hd2Ud4AwfIioCZwKy2ZrwYjUOA3jsvRycHLLv6RKwCFKv7Gw5BzMLNhm3Ty3jr_tMv9DNuT3Hs59leAfi4pKMzv_SEU3jIXjPk_dsxr2Zpn_Hwqk38koscyrZFlv-3BxLJjYAXfHnHlK-36tfxOZaa7OcgBA&mv=84271930.com.android.vending&lft=-1&vnm=1.0&u_sd=2.625&request_id=1297566233&rafmt=102&target_api=34&carrier=20801&seq_num=1&eid=318496669%2C318500618%2C318486317%2C318491267%2C318470420%2C318470427%2C318482447%2C318483611%2C318484497%2C318484801%2C318499680%2C318500237%2C318501517%2C318502071%2C318505948%2C318503704%2C318503719%2C318503826%2C318505586%2C318516325%2C318515867%2C318516088&gdpr=1&gdpr_consent=CQCnvEAQCnvEAEsACBENA_FoAP_gAEPgACiQINJB7C7FbSFCwH5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAQFASgBAACAAAAICZBIQIECAAACUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAAAAEAAIAAAAEAAAmAgAAIIACAAAhAAAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAQOhSD2F2K2kKFkPCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIFAAAAAAAAAQEiCQAAQABAAEIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAAAAIAAQAAAAIAABEhCAAQQAEAAAAAAAQAAAAAAAAAAABAAA&addtl_consent=2~70.89.93.108.122.149.196.236.259.311.313.323.358.415.449.486.494.495.540.574.609.827.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1423.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.2072.2253.2299.2357.2373.2415.2506.2526.2568.2571.2575.2624.2677~dv.&guci=0.0.0.0.0.0.0.128&_npr=0&sdk_apis=7%2C8&omid_p=Google%2Fafma-sdk-a-v243220999.242402000.1&u_w=412&u_h=842&msid=com.google.android.gms.example.bannerexample&an=1.android.com.google.android.gms.example.bannerexample&u_audio=3&net=wi&u_so=p&loeid=44766145&preqs_in_session=2&support_transparent_background=true&preqs=0&time_in_session=702890&sst=1725980760000&output=html&region=mobile_app&u_tz=120&url=1.android.com.google.android.gms.example.bannerexample.adsenseformobileapps.com&gdfp_req=1&m_ast=afmajs&impl=ifr&iu=%2F21775744923%2Fexample%2Fadaptive-banner&sz=411x64&correlator=1556169477755687&gsb=wi&lite=0&app_wp_code=ca-app-pub-9939518381636264&app_code=1092563270&caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&bisch=true&blev=0.84&canm=false&_mv=84271930.com.android.vending&heap_free=248092672&heap_max=268435456&heap_total=268435456&wv_count=1&rdps=9200&cust_params=excl_cat&is_lat=false&blob=ABPQqLE33BRdgWDS5QUh7mZxNO7lOed1JeUtIzQC9c4n94GtLwSrCMo97Q5k8TaVn7em2bGj9DRWtD1fc9tdURiVvHwBNL29H0fYGzRmCY9mGRhxVzMaN7yQDbQspk2YPrE8PnKT1-7yhdO0uig7BE0PKFcp8TNO5b6GD1o_Aomj4mECkACVNcOW9R8tp5XN1GILxxIdlaz51Z2R1CgIMIGjqCOqQeOdYG3jzi99oIbbtbJzhvDofA9U6FGx_cK3I1SoQ5WCgWFOEuQV5BhoLQ_Z3ZQGer8vv_FM4Z9CshPnZj18WG9PoT1MgIsrUjajgiz3SqTCppxEntnJsbx8zkyCOJ-78sxwM4_9zVM1qHNXAKxg0xyDKx-tVUi1yu2yemPMRtxkIXYZo-TpaKw&adk=975296962&jsv=sdk_20190107_RC02-production-sdk_20240819_RC00#caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&eid=318496669%252C318500618%252C318486317%252C318491267%252C318470420%252C318470427%252C31848%252C318484497%252C318484801%252C318499680%252C318500237%252C318501517%252C318502071%252C318505948%252C318503704%252C318503719%252C318503826%252C318505586%252C318516325%252C318515867%252C318516088&format=411x64_as&heap_free=248092672&heap_max=268435456&heap_total=268435456&js=afma-sdk-a-v243220999.242402000.1&msid=com.google.android.gms.example.bannerexample&preqs=0&seq_num=1&target_api=34",
        iu: "/21775744923/example/adaptive-banner",
        sz: "411x64",
        cust_params: ["excl_cat"],
      },
    },
    {
      id: 8,
      eventId: "network_request_e7e55843-0ecf-4c07-aa52-b62360b54f00",
      type: "ad_response",
      timestamp: 9003,
      absoluteTime: "2024-09-10T15:17:47.002Z",
      gmaParams: { debugDialog: [] },
    },
    {
      id: 9,
      eventId: "network_request_9ffad2e3-0bfc-466a-85ea-bb2f6d6d5523",
      type: "sdk_mad",
      timestamp: 9435,
      absoluteTime: "2024-09-10T15:17:47.434Z",
      gmaParams: {},
    },
    {
      id: 10,
      eventId: "network_request_d04ab742-0510-4db4-9037-01dd480d43cf",
      type: "impression",
      timestamp: 9810,
      absoluteTime: "2024-09-10T15:17:47.809Z",
      gmaParams: {},
    },
    {
      id: 11,
      eventId: "network_request_48cc5326-0eab-44ba-a315-40a6a77d63d9",
      type: "viewable",
      timestamp: 10949,
      absoluteTime: "2024-09-10T15:17:48.948Z",
      gmaParams: {},
    },
    {
      id: 12,
      eventId: "network_request_0661a93c-40a6-46a6-91cf-f2c08631ecab",
      type: "ad_request",
      timestamp: 12185,
      absoluteTime: "2024-09-10T15:17:50.184Z",
      gmaParams: {
        request_url:
          "https://pubads.g.doubleclick.net/gampad/ads?submodel=Pixel%206&adid_p=1&format=411x64_as&omid_v=a.1.4.10-google_20240110&dv=243220703&ev=23.3.0&gl=FR&hl=fr&js=afma-sdk-a-v243220999.242402000.1&lv=242402501&ms=CugDmsA_ATEaPwF_uwiQE0A0AKnJ7U0jPVzKHeFdLpuue_6_bqb-39cooFDVKsIqLr_hSPzg-WyOkobEGUWWzzfKvjmy3kIIBxKfAywklo6o9AhAS1emNDA64Ni5nPffSBUwJX1l6efFbpqpGyMYanf1GSZl-rDq0w-5iMCAebyhJiTrs23wt919IFyOCDNKk4CnlsusTJir8j-Hroklg-f3hhx7ol2MaySC8m1M4Z50BmbsMsN0guy1PLgwyDWbSN5sKCpxjwSOxwFXNy1E_G33tBpljE4DSeayVAPP3nUy6tBHwTSqKF5u9RhhOcGV6ZgFDkISdmB2WIg1ut0A8YxmhCrsxJHdoB-5CtO2Dx6MdPRSe80t9WDN1ryEgUGUr_bunhCwd0hH5-I4SawZe6DMpjfTFyJmbLuBFYgRkleh5_S40mvQr8Odt5igkRjWnvZi34L-S7gJ-c-o32DDZhtDo9WX9ZgoCc1TQXNiyOdHLKq8hhH4qx4qbiPeuQRjmVGP5lUcr9R_dsREOMOpfmOBcqOGN-Y5eJZ5xbyXYeegtJGqoWyQDPi6V6vADTi_vB8XTGL35isLjvehmOUGfUyFeUMKvkXeD_4ZSBcC1J4wVa9TcI2slZ5L6Xv2KRxTwMfS1MiU93b0G9YgBA&mv=84271930.com.android.vending&lft=-1&vnm=1.0&u_sd=2.625&request_id=755019145&rafmt=102&target_api=34&carrier=20801&seq_num=2&eid=318496669%2C318500618%2C318486317%2C318491267%2C318470420%2C318470427%2C318482447%2C318483611%2C318484497%2C318484801%2C318499680%2C318500237%2C318501517%2C318502071%2C318505948%2C318503704%2C318503719%2C318503826%2C318505586%2C318516325%2C318515867%2C318516088&gdpr=1&gdpr_consent=CQCnvEAQCnvEAEsACBENA_FoAP_gAEPgACiQINJB7C7FbSFCwH5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAQFASgBAACAAAAICZBIQIECAAACUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAAAAEAAIAAAAEAAAmAgAAIIACAAAhAAAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAQOhSD2F2K2kKFkPCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIFAAAAAAAAAQEiCQAAQABAAEIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAAAAIAAQAAAAIAABEhCAAQQAEAAAAAAAQAAAAAAAAAAABAAA&addtl_consent=2~70.89.93.108.122.149.196.236.259.311.313.323.358.415.449.486.494.495.540.574.609.827.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1423.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.2072.2253.2299.2357.2373.2415.2506.2526.2568.2571.2575.2624.2677~dv.&guci=0.0.0.0.0.0.0.128&_npr=0&sdk_apis=7%2C8&omid_p=Google%2Fafma-sdk-a-v243220999.242402000.1&u_w=412&u_h=842&msid=com.google.android.gms.example.bannerexample&an=1.android.com.google.android.gms.example.bannerexample&u_audio=3&net=wi&u_so=p&loeid=44766145&preqs_in_session=3&support_transparent_background=true&preqs=1&time_in_session=707720&dload=2492&sst=1725980760000&output=html&region=mobile_app&u_tz=120&url=1.android.com.google.android.gms.example.bannerexample.adsenseformobileapps.com&gdfp_req=1&m_ast=afmajs&impl=ifr&iu=%2F21775744923%2Fexample%2Fadaptive-banner&sz=411x64&correlator=2908779786099150&gsb=wi&lite=0&app_wp_code=ca-app-pub-9939518381636264&app_code=1092563270&caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&bisch=true&blev=0.84&canm=false&_mv=84271930.com.android.vending&heap_free=7786912&heap_max=268435456&heap_total=67108864&wv_count=4&rdps=9200&cust_params=excl_cat&is_lat=false&blob=ABPQqLG7hbxMDOvldpMGUvQSOv7lNUCWDXNImjNjjQ1gKkHMPuHQxYFlUlWrUsWfaVPER76GRPRcqhjbgxftaHLZFT78aNQETsiZqmJXYbrRbtBKMgbWQwU32WXkmieMdPHmXvWtaOVmtqn3S5g89Wna1JuhRwRuSUwWy5tePRN7kB9ZqwABKWx_ApNWRInyJIWizhek2l1C3uZrmY3MqWJAEOlzAdmyVncI7IAJS1Rk_0KDcC2L6WLNdY3FPdyaVLRRREzF1hDFGstbymtaW0GK-0JuyV6cJnPpuBZW2_J1OO37yCd-5zPgvz6BQZMXyb-J92iy4XRjayqrRWy5XTHVeiBYq9bDm0yHLFjw6NoCwM-A1LRthcrszecGYvd0mdlZgPJEQmnwYEdMuV4&adk=975296962&jsv=sdk_20190107_RC02-production-sdk_20240819_RC00#caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&eid=318496669%252C318500618%252C318486317%252C318491267%252C318470420%252C318470427%258483611%252C318484497%252C318484801%252C318499680%252C318500237%252C318501517%252C318502071%252C318505948%252C318503704%252C318503719%252C318503826%252C318505586%252C318516325%252C318515867%252C318516088&format=411x64_as&heap_free=7786912&heap_max=268435456&heap_total=67108864&js=afma-sdk-a-v243220999.242402000.1&msid=com.google.android.gms.example.bannerexample&preqs=1&seq_num=2&target_api=34",
        iu: "/21775744923/example/adaptive-banner",
        sz: "411x64",
        cust_params: ["excl_cat"],
      },
    },
    {
      id: 13,
      eventId: "network_request_0661a93c-40a6-46a6-91cf-f2c08631ecab",
      type: "ad_response",
      timestamp: 12500,
      absoluteTime: "2024-09-10T15:17:50.499Z",
      gmaParams: { debugDialog: [] },
    },
    {
      id: 14,
      eventId: "network_request_98f7525e-403f-49fd-bb9b-9cf72093dc7e",
      type: "impression",
      timestamp: 12990,
      absoluteTime: "2024-09-10T15:17:50.989Z",
      gmaParams: {},
    },
    {
      id: 15,
      eventId: "network_request_1bc2dded-7a67-4a6a-9d8a-e0cfcca220cd",
      type: "viewable",
      timestamp: 14081,
      absoluteTime: "2024-09-10T15:17:52.080Z",
      gmaParams: {},
    },
    {
      id: 16,
      eventId: "network_request_52b24f4d-716b-4630-9ff4-badd10de1c04",
      type: "ad_request",
      timestamp: 15662,
      absoluteTime: "2024-09-10T15:17:53.661Z",
      gmaParams: {
        request_url:
          "https://pubads.g.doubleclick.net/gampad/ads?submodel=Pixel%206&adid_p=1&format=411x64_as&omid_v=a.1.4.10-google_20240110&dv=243220703&ev=23.3.0&gl=FR&hl=fr&js=afma-sdk-a-v243220999.242402000.1&lv=242402501&ms=CugDmsA_ATEaPwF_uwiQE0A0AKnJ7U0jPVzKHeFdLpuue_6_bqb-39cooFDVKsIqLr_hSPzg-WyOkobEGUWWzzfKvjmy3kIIBxKfAywklo6o9AhAS1emNDA64Ni5nPffSBUwJX1l6efFbpqpGyMYanf1GSZl-rDq0w-5iMCAebyhJiTrs23wt919IFyOCDNKk4CnlsusTJir8j-Hroklg-f3hhx7ol2MaySC8m1M4Z50BmbsDcN0guy1PLhg1aAmhRGaPEy__FiOUFCGx-0nWLF5PK7XtTllAMVuqtbpSpQRH98EKZnkGfEDZSwcX47leaAEa-dQWJXdDOaJNDHT6Yalg0euQ40ZwD-VOazGImnOzxNdpbuk56y9JF_sTuydXw8L9OGDC3qbABBNoKWzCFF8Nh2wP1jus88Vn3JVi4Hv4JZpmQiarx2uOSl-nO8lBl5lPdy0z24LXzCgGXYKCTxA2lGsgYxeeIyYag4RhhK2DaTRlMaLJiYAaDRQkoCwXXwJ5jfBMYwRsIhmsO8RuxQm77YQ832MVSqi_MVXBBJ4Z1iN5AJ-KICKjZEWpP2MGj8vH8OVRnvtnJvyiJLWSkc2mW1rHyrkssTpwGo-mnNkbl5AqAOopPhKcVyVcvSebXrm6rrTX9VBnKsgBA&mv=84271930.com.android.vending&lft=-1&vnm=1.0&u_sd=2.625&request_id=287738987&rafmt=102&target_api=34&carrier=20801&seq_num=3&eid=318496669%2C318500618%2C318486317%2C318491267%2C318470420%2C318470427%2C318482447%2C318483611%2C318484497%2C318484801%2C318499680%2C318500237%2C318501517%2C318502071%2C318505948%2C318503704%2C318503719%2C318503826%2C318505586%2C318516325%2C318515867%2C318516088&gdpr=1&gdpr_consent=CQCnvEAQCnvEAEsACBENA_FoAP_gAEPgACiQINJB7C7FbSFCwH5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAQFASgBAACAAAAICZBIQIECAAACUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAAAAEAAIAAAAEAAAmAgAAIIACAAAhAAAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAQOhSD2F2K2kKFkPCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIFAAAAAAAAAQEiCQAAQABAAEIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAAAAIAAQAAAAIAABEhCAAQQAEAAAAAAAQAAAAAAAAAAABAAA&addtl_consent=2~70.89.93.108.122.149.196.236.259.311.313.323.358.415.449.486.494.495.540.574.609.827.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1423.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.2072.2253.2299.2357.2373.2415.2506.2526.2568.2571.2575.2624.2677~dv.&guci=0.0.0.0.0.0.0.128&_npr=0&sdk_apis=7%2C8&omid_p=Google%2Fafma-sdk-a-v243220999.242402000.1&u_w=412&u_h=842&msid=com.google.android.gms.example.bannerexample&an=1.android.com.google.android.gms.example.bannerexample&u_audio=3&net=wi&u_so=p&loeid=44766145&preqs_in_session=4&support_transparent_background=true&preqs=2&time_in_session=711210&dload=866&sst=1725980760000&output=html&region=mobile_app&u_tz=120&url=1.android.com.google.android.gms.example.bannerexample.adsenseformobileapps.com&gdfp_req=1&m_ast=afmajs&impl=ifr&iu=%2F21775744923%2Fexample%2Fadaptive-banner&sz=411x64&correlator=312609994845700&gsb=wi&lite=0&app_wp_code=ca-app-pub-9939518381636264&app_code=1092563270&caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&bisch=true&blev=0.84&canm=false&_mv=84271930.com.android.vending&heap_free=32304720&heap_max=268435456&heap_total=51087744&wv_count=5&rdps=9200&cust_params=excl_cat&is_lat=false&blob=ABPQqLFBmhrKIv_ybhAOVwsOvQxQ6I90pepvhNn7-C1FjEYA5ebJNwrHQsVQFd8ZVZ4lC0FdJLFRHGr-oOvam4I2fWDcv1BhwgpHrT9A7hhqbUMpk-jw3bEQ-lRNJE7p5rQVwmLBOLxu3QOZgks46w9CNlFcZHfc28xFOHs5nnxBPwHa4QA_BPGCtMkLinuhVLqvj5z_tk1CK8_rNlWdedcEnXIM6zL1c6SS2rc_2oCphswx0EZkUnCWhxzaTn7EDEtluJ9MUIjzt-S6hvx1ZzN1oR-8_bhDJTxg7VcEMwV2r4MDoTzYPihLdYmIlH41D6ZhRQsIM55rpAVT5Te8zd4HHi6wncE30maiC5oQ9Z_6hIy0AGm12hr_EqhDu3iCsESJJEKNmaoChjzxTxo&adk=975296962&jsv=sdk_20190107_RC02-production-sdk_20240819_RC00#caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&eid=318496669%252C318500618%252C318486317%252C318491267%252C318470420%252C318470427%252483611%252C318484497%252C318484801%252C318499680%252C318500237%252C318501517%252C318502071%252C318505948%252C318503704%252C318503719%252C318503826%252C318505586%252C318516325%252C318515867%252C318516088&format=411x64_as&heap_free=32304720&heap_max=268435456&heap_total=51087744&js=afma-sdk-a-v243220999.242402000.1&msid=com.google.android.gms.example.bannerexample&preqs=2&seq_num=3&target_api=34",
        iu: "/21775744923/example/adaptive-banner",
        sz: "411x64",
        cust_params: ["excl_cat"],
      },
    },
    {
      id: 17,
      eventId: "network_request_52b24f4d-716b-4630-9ff4-badd10de1c04",
      type: "ad_response",
      timestamp: 16121,
      absoluteTime: "2024-09-10T15:17:54.120Z",
      gmaParams: { debugDialog: [] },
    },
    {
      id: 18,
      eventId: "network_request_edfc6d89-0fe0-492b-b980-74ea664c23e3",
      type: "impression",
      timestamp: 16840,
      absoluteTime: "2024-09-10T15:17:54.839Z",
      gmaParams: {},
    },
    {
      id: 19,
      eventId: "network_request_34df8fbf-7d79-4cff-a179-91877c7dad6b",
      type: "viewable",
      timestamp: 18118,
      absoluteTime: "2024-09-10T15:17:56.117Z",
      gmaParams: {},
    },
    {
      id: 20,
      eventId: "network_request_e68fa861-01c6-4965-914f-2896768628a0",
      type: "ad_request",
      timestamp: 18668,
      absoluteTime: "2024-09-10T15:17:56.667Z",
      gmaParams: {
        request_url:
          "https://pubads.g.doubleclick.net/gampad/ads?submodel=Pixel%206&adid_p=1&format=411x64_as&omid_v=a.1.4.10-google_20240110&dv=243220703&ev=23.3.0&gl=FR&hl=fr&js=afma-sdk-a-v243220999.242402000.1&lv=242402501&ms=CugDmsA_ATEaPwF_uwiQE0A0AKnJ7U0jPVzKHeFdLpuue_6_bqb-39cooFDVKsIqLr_hSPzg-WyOkobEGUWWzzfKvjmy3kIIBxKfAywklo6o9AhAS1emNDA64Ni5nPffSBUwJX1l6efFbpqpGyMYanf1GSZl-rDq0w-5iMCAebyhJiTrs23wt919IFyOCDNKk4CnlsusTJir8j-Hroklg-f3hhx7ol2MaySC8m1M4Z50BmbsCMN0guy1PLiPemxeDuC4xl2ZLryKWKpaJF7YAqjXNiLfbbI4J01SqMNNIpQ9WON_s6eBHW_io3PFO3D2rzOn4w2wLqkuuZJQhGNgKDWhYpknkGhSNx9eW0g2743f8hCkFyZJtSGvGkZ_VhzOqEpXZmNG75G5nXpuMFmuHl0IHDz-v7wIqs_qziYk2g9yO6w7LYOqgQF-WGy6ac4JHaeSQUDyXrxTBvgebyY0GhQmXiAdm91OdkNX4ddKYc6Fh8GWEMx7KjER34k0OvMHRdTKSiceIdr-nkx2OPu5OxkAug92TziGFJ_xLFsaUu975HZ-G-a6FhRCn6qMdIP_v49pAdqNl0ds6vDbK2JeYuMumqmJrVgOyILCJkqbkNHf7EIqIMcoLJtjr80mivjnsw9vDe2XcLzteUogBA&mv=84271930.com.android.vending&lft=-1&vnm=1.0&u_sd=2.625&request_id=1097347290&rafmt=102&target_api=34&carrier=20801&seq_num=4&eid=318496669%2C318500618%2C318486317%2C318491267%2C318470420%2C318470427%2C318482447%2C318483611%2C318484497%2C318484801%2C318499680%2C318500237%2C318501517%2C318502071%2C318505948%2C318503704%2C318503719%2C318503826%2C318505586%2C318516325%2C318515867%2C318516088&gdpr=1&gdpr_consent=CQCnvEAQCnvEAEsACBENA_FoAP_gAEPgACiQINJB7C7FbSFCwH5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAQFASgBAACAAAAICZBIQIECAAACUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAAAAEAAIAAAAEAAAmAgAAIIACAAAhAAAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAQOhSD2F2K2kKFkPCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIFAAAAAAAAAQEiCQAAQABAAEIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAAAAIAAQAAAAIAABEhCAAQQAEAAAAAAAQAAAAAAAAAAABAAA&addtl_consent=2~70.89.93.108.122.149.196.236.259.311.313.323.358.415.449.486.494.495.540.574.609.827.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1423.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.2072.2253.2299.2357.2373.2415.2506.2526.2568.2571.2575.2624.2677~dv.&guci=0.0.0.0.0.0.0.128&_npr=0&sdk_apis=7%2C8&omid_p=Google%2Fafma-sdk-a-v243220999.242402000.1&u_w=412&u_h=842&msid=com.google.android.gms.example.bannerexample&an=1.android.com.google.android.gms.example.bannerexample&u_audio=3&net=wi&u_so=p&loeid=44766145&preqs_in_session=5&support_transparent_background=true&preqs=3&time_in_session=714220&dload=1224&sst=1725980760000&output=html&region=mobile_app&u_tz=120&url=1.android.com.google.android.gms.example.bannerexample.adsenseformobileapps.com&gdfp_req=1&m_ast=afmajs&impl=ifr&iu=%2F21775744923%2Fexample%2Fadaptive-banner&sz=411x64&correlator=860014011744129&gsb=wi&lite=0&app_wp_code=ca-app-pub-9939518381636264&app_code=1092563270&caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&bisch=true&blev=0.84&canm=false&_mv=84271930.com.android.vending&heap_free=15765856&heap_max=268435456&heap_total=51087744&wv_count=6&rdps=9200&cust_params=excl_cat&is_lat=false&blob=ABPQqLGTSTHHNFzsciS7RH8TrELpl3Z7sPwq9MFW9RYBtVlymsVUQBdBvd3brwy6Xaqpe5zhxGNwe5rckIJimi0I5fj2Ex2tdaPpTb5V0LKzAFs12vTFZHXu6dVx_BIZOC5vd4fYviqBlQypPQzHICVEiA1n3EMjz77HfglFnLlHIsqvzwBWYZJTcMzE801XhpTKNCnCIOezzIXIjp3QvQfmJ4l2VbKpuGydlL64HHUQOpp8tl1OXoLCC-XtEJuE6v5rWw5k6YyioA1QYz9EbRL04sdv63xpLCgYufe1BCJZ64z6jNyzZmjoQ8XmC2Av-AWhjGZ7hkU2fZ6Rdqbtz8Oye8x95AGqWTxlv-HB5bZH0isu1YkEVgmvLXLJYK6vfzpXW55lnNbMI5InSgU&adk=975296962&jsv=sdk_20190107_RC02-production-sdk_20240819_RC00#caps=inlineVideo_interactiveVideo_mraid1_mraid2_mraid3_sdkVideo_exo3_th_autoplay_mediation_scroll_av_transparentBackground_sdkAdmobApiForAds_di_aso_sfv_dinm_dim_nav_navc_dinmo_ipdof_gls_gcache_sai_demuxedGcache_xSeconds&eid=318496669%252C318500618%252C318486317%252C318491267%252C318470420%252C318470427%218483611%252C318484497%252C318484801%252C318499680%252C318500237%252C318501517%252C318502071%252C318505948%252C318503704%252C318503719%252C318503826%252C318505586%252C318516325%252C318515867%252C318516088&format=411x64_as&heap_free=15765856&heap_max=268435456&heap_total=51087744&js=afma-sdk-a-v243220999.242402000.1&msid=com.google.android.gms.example.bannerexample&preqs=3&seq_num=4&target_api=34",
        iu: "/21775744923/example/adaptive-banner",
        sz: "411x64",
        cust_params: ["excl_cat"],
      },
    },
    {
      id: 21,
      eventId: "network_request_e68fa861-01c6-4965-914f-2896768628a0",
      type: "ad_response",
      timestamp: 19192,
      absoluteTime: "2024-09-10T15:17:57.191Z",
      gmaParams: { debugDialog: [] },
    },
    {
      id: 22,
      eventId: "network_request_c3f79308-8344-4289-abc5-fd6bc991df40",
      type: "impression",
      timestamp: 19744,
      absoluteTime: "2024-09-10T15:17:57.743Z",
      gmaParams: {},
    },
    {
      id: 23,
      eventId: "network_request_83cfcd5d-4ea0-4627-b64d-28e11db4f11f",
      type: "viewable",
      timestamp: 20825,
      absoluteTime: "2024-09-10T15:17:58.824Z",
      gmaParams: {},
    },
  ];
  return logs.map((item) => {
    return { ...item, absoluteTime: new Date(item.absoluteTime) } as LogEvent;
  });
}
