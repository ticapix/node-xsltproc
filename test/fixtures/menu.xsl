<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output encoding="utf-8" indent="no" method="html"/>
  <xsl:template match="menu">
    <xsl:for-each select="breakfast_menu/food">
      <div style="background-color:teal;color:white;padding:4px">
        <span style="font-weight:bold"><xsl:value-of select="name"/> - </span>
        <xsl:value-of select="price"/>
      </div>
      <div style="margin-left:20px;margin-bottom:1em;font-size:10pt">
        <p>
          <xsl:value-of select="description"/>
          <span style="font-style:italic"> (<xsl:value-of select="calories"/> calories per serving)</span>
        </p>
      </div>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
