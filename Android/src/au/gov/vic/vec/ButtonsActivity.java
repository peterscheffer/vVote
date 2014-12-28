package au.gov.vic.vec;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import au.gov.vic.vec.vvotewebview.R;

public class ButtonsActivity extends Activity implements OnClickListener {

	private Button urlButton;
	private Button pgpButton;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_buttons);
		
		urlButton = (Button)findViewById(R.id.urlButton);
		urlButton.setOnClickListener(this);

		pgpButton = (Button)findViewById(R.id.localButton);
		pgpButton.setOnClickListener(this);
	}

	@Override
	public void onClick(View v) {
		if (urlButton.isPressed()) {
			Intent i = new Intent(this, URLActivity.class);
			this.startActivity(i);
		}
/*
		if (pgpButton.isPressed()) {
			Intent i = new Intent(this, PGPActivity.class);
			this.startActivity(i);
		}
*/
	}
}
