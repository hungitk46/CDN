const host = `http://127.0.0.1:4200`;
const tenantAssetUrl = `${host}/assets`;
const serverUrl = `http://localhost:1842`;
const tenantOptions = [{
    name: 'rrts-dev',
    realm: 'Username-Password-Authentication',
    assets: {
      background: `${tenantAssetUrl}/themes/ascent/img/background.png`,
      logo: `${tenantAssetUrl}/themes/ascent/img/logo.png`,
      style: `${tenantAssetUrl}/themes/ascent/style/css/login.css`,
    }
  },
  {
    name: 'base',
    realm: 'Username-Password-Authentication',
    assets: {
      background: `${tenantAssetUrl}/assets/themes/base/img/background.png`,
      logo: `${tenantAssetUrl}/themes/base/img/logo.png`,
      style: `${tenantAssetUrl}/themes/base/style/css/login.css`,
    }
  }
]

function getTenantOptionsByName(tenantName) {
  return tenantOptions.find(tenant => tenant.name === tenantName);
}
