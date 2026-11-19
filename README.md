# Hosted Where

[Open Hosted Where](https://coolcode.ca/hosted-where/)

Compare what Canadian institutions disclose about a service provider, mail gateway and storage location.

<!-- coolcode:guide -->
Compare Dalhousie email with University of Victoria OneDrive. One guide identifies the mail provider, while the other explicitly locates stored files in Canada. The MX interpreter also accepts records pasted privately.
<!-- /coolcode:guide -->

## Interpreting the evidence

Choose two institutional services, compare their stated providers and storage locations, and open the institution’s own guide or policy. The browser also filters the source table by geography and whether the cited document gives a location. Download a filtered CSV or share the current comparison URL. Coverage begins with BC, Nova Scotia and selected federal services.

A provider name, a mail filtering service and a data location answer different questions. The two email services include a dated public MX observation in addition to the institution’s service description. A lower MX number is a higher delivery preference. A local interpreter reads DNS-over-HTTPS JSON, pasted answer-section text and priority/host pairs; no pasted input leaves the browser. The current guide and GC Notify’s archived July 2021 regional statement appear separately.

The collector checks the quoted evidence terms monthly, verifies the Halifax guidebook PDF against its reviewed digest and updates the named mail observations through Google Public DNS. A missing required source, changed PDF or DNS error stops the refresh for review. Source checks confirm the reviewed material still exists; the index describes only the cited services.

Run `python scripts/refresh.py` to update the public evidence, `node --test tests/*.test.mjs` and `python -m unittest discover -s tests` to test, and `python scripts/build.py` to produce the static site.
