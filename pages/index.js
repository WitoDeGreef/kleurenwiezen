import Card from '../components/card';

export default function Home() {
  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <div className="title-section-ourmenu t-center m-b-22">
          <span className="tit2 t-center">
            Kies een categorie
          </span>
        </div>
  
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-sm-6">
                <Card url="fun" size="size4" image="fun.jpg" name="Fun" />
              </div>
  
              <div className="col-sm-6">
                <Card url="deep" size="size5" image="deep.jpg" name="Diep" />
              </div>
  
              <div className="col-12">
                <Card url="bestfriend" size="size6" image="bestfriend.jpg" name="Best Friend" />
              </div>
            </div>
          </div>
  
          <div className="col-md-4">
            <div className="row">
              <div className="col-12">
                <Card url="juicy" size="size8" image="juicy.jpg" name="Juicy" />
              </div>
  
              <div className="col-12">
              <Card url="random" size="size8" image="random.jpg" name="Random" />
              </div>
  
              <div className="col-12">
                <Card url="newfriend" size="size9" image="newfriend.jpg" name="Kennis" />
              </div>
            </div>
          </div>
        </div> 
  
      </div>
    </section>
  );
}
