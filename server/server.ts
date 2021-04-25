
import Bootstrap from './bootstrap';

const bootstrap = new Bootstrap();
bootstrap.run((port:any) => console.log(`Server started and running on port ${port}.`));