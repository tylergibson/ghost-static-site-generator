const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');

const { argv } = yargs(hideBin(process.argv));

/**
 * This is the source domain that ghost is hosted on
 * @type {string}
 */
const SOURCE_DOMAIN = (argv.sourceDomain || argv.domain || 'http://localhost:2368').replace(/\/?$/, '');
/**
 * This is the production domain that ghost will be hosted on, ie. your CDN or S3 bucket
 * @type {string}
 */
const PRODUCTION_DOMAIN = (argv.productionDomain || argv.url || SOURCE_DOMAIN).replace(/\/?$/, '');
const IGNORE_ABSOLUTE_PATHS = argv.ignoreAbsolutePaths || false;
const STATIC_DIRECTORY = argv.dest || 'static';
const SAVE_AS_REFERER = argv.saveAsReferer || false;
const RESPONSIVE_SIZES = argv.responsiveSizes || 'w150,w300,w720,w960,w1200,w2000'

const shouldShowProgress = () => {
  if (argv.silent) {
    return '';
  }

  const showProgressHelpText = execSync(
    'wget --help | grep "show-progress" || true',
  ).toString();

  return `${showProgressHelpText}`.includes('show-progress');
};

const OPTIONS = {
  // This is the path of the static directory the your machine
  ABSOLUTE_STATIC_DIRECTORY: path.resolve(
    process.cwd(),
    `${STATIC_DIRECTORY}`,
  ),
  // This is the --dest flag
  STATIC_DIRECTORY,
  // This is the --domain flag
  SOURCE_DOMAIN,
  // This is the --domain flag without http:// or https://
  SOURCE_DOMAIN_WITHOUT_PROTOCOL: SOURCE_DOMAIN.replace(/^https?:\/\//i, ''),
  // This is the --url flag
  PRODUCTION_DOMAIN,
  // This is the --url flag without http:// or https://
  PRODUCTION_DOMAIN_WITHOUT_PROTOCOL: PRODUCTION_DOMAIN.replace(/^https?:\/\//i, ''),
  // The --silent flag determines if we should show the progress bar or not
  SHOW_PROGRESS_BAR: shouldShowProgress()
    ? '--show-progress '
    : '',
  // --ignore-absolute-paths flag will remove all urls
  IGNORE_ABSOLUTE_PATHS,
  // --save-as-referer flag will save redirected assets using the
  // original url path instead of the redirected destination url
  SAVE_AS_REFERER,
  // --responsive-sizes flag will override the size generator sizes
  // set this to match your image_sizes in package.json
  // otherwise wget can quickly error out from queuing generation tasks on ghost docker hosts.
  RESPONSIVE_SIZES
};

module.exports = OPTIONS;
