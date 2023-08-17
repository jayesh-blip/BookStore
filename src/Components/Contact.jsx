import { Button } from "@material-ui/core";

export default function Contact() {
  return (
    <section>

      <h1 class="center">Contact Us For Any Query</h1>
      <Button variant="contained" onClick={() => window.location = 'mailto:suraniprince007@gmail.com'}>
        E-mail us
        </Button>
        <p>feel free to ask anything</p>
        
    </section>
  );
  
}