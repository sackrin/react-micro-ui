import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';

configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiShallowDeepEqual);
chai.use(chaiEnzyme);

global.jestExpect = global.expect;
global.expect = chai.expect;
